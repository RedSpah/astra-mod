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
	  magick !str! -channel RGB -fill "#F9E042" -opaque "#E094B7" -fill "#DAC340" -opaque "#CB7FA2" -fill "#B2A14E" -opaque "#BB6F91" !replaced!
	)
  )
) 
