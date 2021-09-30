import subprocess
import os
import requests
from pathlib import Path

images = str(Path.home()) + "/tourpaper/images/"
folder = "/tourpaper/"
path = str(Path.home()) + folder
linksFile = path + "/link.txt"

def detect_desktop_environment():
    desktop_environment = 'generic'
    if os.environ.get('KDE_FULL_SESSION') == 'true':
        desktop_environment = 'kde'
    elif os.environ.get('GNOME_DESKTOP_SESSION_ID'):
        desktop_environment = 'gnome'
    else:
        try:
            info = getoutput('xprop -root _DT_SAVE_MODE')
            if ' = "xfce4"' in info:
                desktop_environment = 'xfce'
        except (OSError, RuntimeError):
            pass
    return desktop_environment

def main():
    if(os.path.exists(images) == False):
        os.mkdir(images)

    if(os.stat(linksFile).st_size == 0):
        print("list is not initialised, create the list first !")
        exit(0)

    with open(linksFile, "r+") as file:
        lines = file.readlines()

        # removing the first line
        file.seek(0)
        file.truncate()
        file.writelines(lines[1:])

        wallpaper = lines[0].split(" ")
        name = wallpaper[0]
        
        url = wallpaper[1]

        print("downloading ...", name)
        res = requests.get(url, allow_redirects=True)
        open(images+name, "wb").write(res.content)

        print("setting...", name)
        envi = detect_desktop_environment();
        out = subprocess.check_output( "xrandr | grep ' connected ' | awk '{ print$1 }' " , shell=True)
        mon = out.decode("utf-8").strip()

        print(envi)

        if envi == "gnome":
            os.system(f"gsettings set org.gnome.desktop.background picture-uri {images+name}")
        elif envi == "xfce" :
            os.system(f"xfconf-query -c xfce4-desktop -p /backdrop/screen0/monitor{mon}/workspace0/last-image  -s {images+name}")
