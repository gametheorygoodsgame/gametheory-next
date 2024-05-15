@echo off
setlocal enabledelayedexpansion

set host=gmt.atlasproject.de
set port=4000
set local_ip=127.0.0.1

echo %local_ip% %host% >> %SystemRoot%\System32\drivers\etc\hosts
