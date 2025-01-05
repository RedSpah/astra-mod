@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

for /r %%i in (*) do (
  echo.%%i | find /i ".png">nul && (
    echo.%%i | find /i "blue.png">nul || (
	  set str=%%i
	  set old_end=.png
	  set new_end=_blue.png
	  call set replaced=%%str:!old_end!=!new_end!%%
	  echo !replaced!
	  magick !str! -channel RGB -fill "#E094B7" -opaque "#F9E042" -fill "#CB7FA2" -opaque "#DAC340" -fill "#BB6F91" -opaque "#B2A14E" !replaced!
	)
  )
) 
