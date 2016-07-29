#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-
exec nodejs -- "$(readlink -m "$BASH_SOURCE"/..)"/stdio-pipe.js; exit $?
