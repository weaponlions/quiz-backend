' Set WshShell = CreateObject("WScript.Shell")
' WshShell.Run "cmd /c node dist/index.js > logs\output.log 2>&1", 0, False


Set WshShell = CreateObject("WScript.Shell")
Set Exec = WshShell.Exec("cmd /c node dist/index.js")
Set fso = CreateObject("Scripting.FileSystemObject")

' Save the PID to a file
Dim pidFile
Set pidFile = fso.CreateTextFile("node.pid", True)
pidFile.WriteLine Exec.ProcessID
pidFile.Close
