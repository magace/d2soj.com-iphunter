/**
*  @filename    IPHunter.js
*  @author      kolton, Mercoory, Magace
*  @desc        search for a "hot" IP and stop if the correct server is found
*  @changes     2020.01 - more beeps and movements (anti drop measure) when IP is found; overhead messages with countdown timer; logs to D2Bot console
*  @changes     Magace: Removed use of setting IP in charconfigs, added some more options, logs games to d2soj.com
*
*/

function iphunter() {
    let searchip = [] // This was removed from char config files.  You must set it here or use profileOverrides.
    let logname = "Magace"; //  DONT FORGET TO SET THIS TO YOUR USERNAME ON d2soj.com
    let logD2soj = true;
    let ladderOnly = true;
    let hellOnly = true;
    let useBeep = false;
    let loopDelay = 1000;
    let useRealm = ""; // useast uswest europe
    Config.Silence = false;
    //  Profile Overrides for specific profile settings.
    let profileOverrides = [
      //{ "profile": "iphunter", "ip": "90", "ladder": "nonladder", "realm": "useast", "hellOnly": false },
      //{ "profile": "ipholder", "ip": "91", "ladder": "ladder", "realm": "useast", "hellOnly": false },
    ]
  
    
    let myProfile = me.profile;
    let curRealm = me.realm.toLowerCase()
    let ip = Number(me.gameserverip.split(".")[3]);
    this.checkIp = function() {
      D2Bot.printToConsole("IPHunter: IP found! - [" + ip + "] Game is : " + me.gamename + "//" + me.gamepassword, 7);
      print("IP found! - [" + ip + "] Game is : " + me.gamename + "//" + me.gamepassword);
      me.overhead(":D IP found! - [" + ip + "]");
      me.maxgametime = 999999990; // Added to override SoloPlay Chars.
      if (logD2soj) {
        say("/w *D2SOJ " + ".loggame " + Number(me.gameserverip.split(".")[3]) + ":" + me.profile + ":" + me.ladder + ":" + me.gamename + ":" + me.gamepassword + ":" + logname);
      }
      for (let i = 12; i > 0; i -= 1) {
        me.overhead(":D IP found! - [" + ip + "]" + (i - 1) + " beep left");
        if (useBeep) {
          beep();
        }
        delay(250);
      }
      while (true) {
        me.overhead(":D IP found! - [" + ip + "]");
        try {
          if (logD2soj) {
            say("/w *D2SOJ " + ".loggame " + Number(me.gameserverip.split(".")[3]) + ":" + me.profile + ":" + me.ladder + ":" + me.gamename + ":" + me.gamepassword + ":" + logname);
          }
          Town.move("waypoint");
          delay(250);
          Town.move("stash");
          delay(250);
          sendPacket(1, 0x40);
          delay(250);
        } catch (e) {
          // ensure it doesnt leave game by failing to walk due to desyncing.
        }
        for (let i = (12 * 9); i > 0; i -= 1) {
          me.overhead(":D IP found! - [" + ip + "] Next movement in: " + i + " sec.");
          delay(loopDelay);
        }
      }
    }; 
    let profileOverride = profileOverrides.find(override => override.profile === myProfile);
    if (profileOverride) {
      if (profileOverride.ladder === "nonladder") {
        ladderOnly = false;
      }
      if (profileOverride.ladder === "ladder") {
        ladderOnly = true;
      }    
      hellOnly = profileOverride.hellOnly === true;
      useRealm = profileOverride.realm.toLowerCase();
      searchip = [Number(profileOverride.ip)]; // Override searchip with the value from the profile override
      me.overhead("Profile Override Found - Profile: " + myProfile + ", IP: " + profileOverride.ip + ", Ladder: " + profileOverride.ladder + ", Realm: " + profileOverride.realm);
    } else {
      me.overhead("IP SCRIPT RUNNING - Current IP:" + ip + " Current Realm:" + curRealm);
    }
    if (searchip.indexOf(ip) > -1) {
      if (useRealm) {
        if (curRealm != useRealm) {
          me.overhead("Wrong Realm Skipping....");
          return true;
        }
      }
      if (ladderOnly) {
        if (me.ladder === 0) {
          me.overhead("Ladder Only Skipping...");
          return true;
        }
      }
      if (hellOnly) {
        if (me.diff != 2) {
          me.overhead("Hell Only Skipping...");
          return true;
        }
      }
      this.checkIp();
    }
    return true;
  }