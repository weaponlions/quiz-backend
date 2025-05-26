' @echo off
' :: Kill existing node processes
' taskkill /IM node.exe /F >nul 2>&1

' :: Run the VBS script to start Node.js hidden
' cscript //nologo run-node.vbs



@echo off
if exist node.pid (
    set /p pid=<node.pid
    taskkill /PID %pid% /F >nul 2>&1
    del node.pid
    echo Node process (PID %pid%) has been stopped.
) else (
    echo No PID file found. Is the process running?
)
