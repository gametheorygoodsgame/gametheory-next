#!/bin/bash

host="gmt.atlasproject.de"
port="4000"
local_ip="127.0.0.1"

echo "$local_ip $host" | sudo tee -a /etc/hosts
