#!/usr/bin/env bash

git pull

git status
git add --all
git commit -m $1
git push
