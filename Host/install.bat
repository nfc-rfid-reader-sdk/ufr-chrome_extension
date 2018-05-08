@echo off
set /p id="Enter Chrome extension ID: "
SET _p=%appdata%\dlogic\manifest.json
SET _result=%_p:\=\\%
echo {"name": "com.dlogic.native","description": "UFR","path": "ufr.exe","type": "stdio","allowed_origins": ["chrome-extension://%id%/"]} >data\Windows\manifest.json
echo f | xcopy "data\Windows\manifest.json" "%appdata%\dlogic\manifest.json" /y /f /q > nul
echo f | xcopy "data\Windows\x86\ufr.exe" "%appdata%\dlogic\ufr.exe" /y /f /q > nul
echo Windows Registry Editor Version 5.00> data\\windows\\registry.reg
echo [HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\com.dlogic.native]>> data\\windows\\registry.reg
echo @="%_result%">> data\\windows\\registry.reg
reg import data\\windows\\registry.reg