#!/bin/bash
jspm unbundle
jspm bundle app/main --inject --minify
git add build*
