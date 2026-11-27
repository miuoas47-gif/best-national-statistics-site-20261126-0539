#!/usr/bin/env python3
"""Publish a fresh entry to GitHub via the Contents/Git Data APIs (PAT surrogate).
Usage: publish.py <local_dir> <owner> <repo> <message>
Creates the public repo if missing; commits the dir's files to main via a
fresh git tree (never reads existing file contents). Then sets repo About.
"""
import base64, json, sys, urllib.request, urllib.error
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request, read_json_response

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        raise RuntimeError("redirect refused")

OWNER, REPO, MSG = sys.argv[2], sys.argv[3], sys.argv[4]
LOCAL = sys.argv[1]

def call(method, path, payload=None):
    url = "https://api.github.com" + path
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "Muse-Github-Pat", "Content-Type": "application/json"})
    add_surrogate_to_request(req, "custom.github-pat", allowed_hosts=["api.github.com"])
    try:
        with urllib.request.build_opener(NoRedirect()).open(req, timeout=60) as r:
            return r.status, read_json_response(r)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="ignore")
        print(method, path, e.code, body[:800], file=sys.stderr)
        return e.code, {}

import os
files = []
for root, _dirs, names in os.walk(LOCAL):
    for n in sorted(names):
        if n == "publish.py" or root.endswith("/out"):
            continue
        full = os.path.join(root, n)
        rel = os.path.relpath(full, LOCAL)
        if rel.startswith("out/"):
            continue
        files.append((full, rel))
print("files:", [r for _, r in files])

status, repo = call("GET", f"/repos/{OWNER}/{REPO}")
if status == 404:
    status, repo = call("POST", "/user/repos", {
        "name": REPO, "description": "AmeriStat — national statistics site for the United States. Built by an AI agent for make.fun's \"Make the best national statistics site\" bounty, $50 in USDC.",
        "homepage": "https://make.fun/bounty/best-national-statistics-site-20261126-0539",
        "private": False, "auto_init": False})
    print("create repo:", status, repo.get("html_url"))
    assert status in (201, 202), "repo create failed"
elif status != 200:
    raise SystemExit(f"repo lookup failed: {status}")

# Current main ref (metadata only)
status, ref = call("GET", f"/repos/{OWNER}/{REPO}/git/ref/heads/main")
base_tree = None
parent = None
if status == 200:
    parent = ref["object"]["sha"]
    st, commit = call("GET", f"/repos/{OWNER}/{REPO}/git/commits/{parent}")
    base_tree = commit["tree"]["sha"]
    print("parent commit:", parent)

tree_items = []
for full, rel in files:
    with open(full, "rb") as f:
        content = base64.b64encode(f.read()).decode()
    st, blob = call("POST", f"/repos/{OWNER}/{REPO}/git/blobs",
                    {"content": content, "encoding": "base64"})
    assert st == 201, f"blob failed for {rel}: {st}"
    tree_items.append({"path": rel, "mode": "100644", "type": "blob", "sha": blob["sha"]})

payload = {"tree": tree_items}
if False:
    payload["base_tree"] = base_tree
st, tree = call("POST", f"/repos/{OWNER}/{REPO}/git/trees", payload)
assert st == 201, f"tree failed: {st}"
commit_payload = {"message": MSG, "tree": tree["sha"]}
if parent:
    commit_payload["parents"] = [parent]
st, commit = call("POST", f"/repos/{OWNER}/{REPO}/git/commits", commit_payload)
assert st == 201, f"commit failed: {st}"
sha = commit["sha"]
print("commit:", sha)

if parent:
    st, _ = call("PATCH", f"/repos/{OWNER}/{REPO}/git/refs/heads/main", {"sha": sha, "force": False})
    assert st == 200, f"ref update failed: {st}"
else:
    st, _ = call("POST", f"/repos/{OWNER}/{REPO}/git/refs",
                 {"ref": "refs/heads/main", "sha": sha})
    assert st == 201, f"ref create failed: {st}"

# Repo About
st, _ = call("PATCH", f"/repos/{OWNER}/{REPO}", {
    "description": "AmeriStat — national statistics site for the United States. Built by an AI agent for make.fun's \"Make the best national statistics site\" bounty, $50 in USDC.",
    "homepage": "https://make.fun/bounty/best-national-statistics-site-20261126-0539"})
print("about patch:", st)
st, _ = call("PUT", f"/repos/{OWNER}/{REPO}/topics",
             {"names": ["makefun", "ai-agents", "bounties", "growth"]})
print("topics put:", st)
print("COMMIT_SHA=" + sha)
print("REPO_URL=https://github.com/" + OWNER + "/" + REPO)
