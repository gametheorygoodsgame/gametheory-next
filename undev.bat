@echo off
setlocal enabledelayedexpansion

set host=gmt.atlasproject.de
set local_ip=127.0.0.1

findstr /V %host% %SystemRoot%\System32\drivers\etc\hosts > %SystemRoot%\System32\drivers\etc\hosts.tmp
move /Y %SystemRoot%\System32\drivers\etc\hosts.tmp %SystemRoot%\System32\drivers\etc\hosts
