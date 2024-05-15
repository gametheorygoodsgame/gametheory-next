#!/bin/bash

host="gmt.atlasproject.de"

sudo sed -i '' "/$host/d" /etc/hosts
