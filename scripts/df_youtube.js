/*
	Differences vs. Firefox - refreshFeed commented out
*/

var links = {
    nodes: [],
    hrefs: [],
  },
  options,
  expandContent = false,
  expandContentTimeout = null,
  refreshFeed = false;

function initiate() {
  console.log("initiating DF Tube");
  document.getElementsByTagName("html")[0].style.display = "";
  hide_Distractions();
}

function hide_Distractions() {
  add_css("df_youtube_common.css");
  add_css("df_youtube.css");
  set_hide_feed(
    options.visibility.hideFeed,
    document.URL === "https://www.youtube.com/" &&
      options.visibility.hideRecommended
  );
  set_hide_sidebar(
    options.visibility.hideSidebar,
    options.visibility.hidePlaylist,
    options.visibility.hideLiveChat
  );
  set_hide_subbar(options.visibility.hideSubBar);
  set_hide_comments(options.visibility.hideComments);
  set_hide_trending(options.visibility.hideTrending);
  set_hide_related(options.visibility.hideRelated);
  set_hide_merch(options.visibility.hideMerch);
  set_hide_notification_bell(options.visibility.hideNotificationBell);
  set_hide_non_lists(options.visibility.hideNonLists);
  set_hide_shorts(options.visibility.hideShorts);
}

function set_hide_trending(hide) {
  if (hide) {
    add_css("trending.css");
  } else {
    remove_css("trending.css");
  }
}

function set_hide_feed(hideFeed, hideRecommended) {
  //HIDE IN DF_YOUTUBE_COMMON.CSS TO PREVENT FLASHING
  if (hideFeed) {
    remove_css("show_feed.css");
    add_css("hide_feed.css");
    // feed.style.setProperty('display', 'none', 'important');
  } else {
    if (hideRecommended) {
      document.querySelectorAll("span#title").forEach(function (item) {
        var found = false;
        if (!found && item.innerHTML == "Recommended") {
          var contentNode = find_parent_by_class(
            item,
            "ytd-item-section-renderer"
          );

          if (contentNode.className.search("dfyoutube_hidden") == -1)
            contentNode.className += " dfyoutube_hidden ";
        }
      });
      // add_css('hide_recommended.css');
    } else {
      document
        .querySelectorAll(".ytd-item-section-renderer")
        .forEach(function (item) {
          item.className = item.className.replace("dfyoutube_hidden", "");
        });
      // remove_css('hide_recommended.css');
    }

    // if (refreshFeed && document.URL == "https://www.youtube.com/") {
    // 	window.location = window.location;
    // 	return;
    // }

    remove_css("prehide_feed.css");
    remove_css("hide_feed.css");
    add_css("show_feed.css");
  }
}

function set_hide_sidebar(hide, hidePlaylists, hideLiveChat) {
  if (hide) {
    add_css("hide_sidebar_contents.css");
  } else {
    remove_css("hide_sidebar_contents.css");
  }

  if (
    (hidePlaylists || document.URL.search("list=") === -1) &&
    (hideLiveChat || document.querySelector("ytd-live-chat-frame") == null)
  ) {
    add_css("hide_chat.css");
    expandContent = true;
  } else {
    expandContent = false;
    remove_css("hide_chat.css");
  }
}

function set_hide_subbar(hide) {
  if (hide) {
    add_css("hide_subbar.css");
  } else {
    remove_css("hide_subbar.css");
  }
}

function set_hide_comments(hide) {
  if (hide) {
    add_css("hide_comments.css");
  } else {
    remove_css("hide_comments.css");
  }
}

function set_hide_related(hide) {
  if (hide) add_css("hide_related_videos.css");
  else remove_css("hide_related_videos.css");
}

function set_hide_merch(hide) {
  if (hide) add_css("hide_merch.css");
  else remove_css("hide_merch.css");
}

function set_hide_notification_bell(hide) {
  if (hide) {
    document.title = document.title.replace(/ *\([0-9]+\)/, "");
    add_css("hide_notification_bell.css");
  } else remove_css("hide_notification_bell.css");
}

function set_hide_non_lists(hide) {
  if (hide) add_css("hide_non_lists.css");
  else remove_css("hide_non_lists.css");
}

function set_hide_shorts(hide){
    if (hide) add_css("hide_shorts.css");
    else remove_css("hide_shorts.css");
}

function add_css(file) {
  var checkLink = document.querySelector(
      'link[href="' + chrome.extension.getURL("css/" + file) + '"]'
    ),
    link;

  if (checkLink === null) {
    link = document.createElement("link");
    link.href = chrome.extension.getURL("css/" + file);
    link.type = "text/css";
    link.rel = "stylesheet";
    link.media = "screen,print";
    document.getElementsByTagName("head")[0].appendChild(link);
  }
}

function remove_css(file) {
  var link = document.querySelectorAll(
    'link[href="' + chrome.extension.getURL("css/" + file) + '"]'
  );

  if (link.length > 0) {
    for (var i = 0; i < link.length; i++) {
      link[i].parentNode.removeChild(link[i]);
    }
  }
}

function find_parent_by_class(node, className) {
  var parent = node.parentNode;
  while (parent != document) {
    if (parent.className.search(className) >= 0) return parent;
    parent = parent.parentNode;
  }

  return undefined;
}

function get_default_options() {
	return {
		active: true,
		disableAutoplay: true,
		alert: false,
		visibility: {
			hideNotificationBell: false,
			hideRecommended: true,
			hideFeed: true,
			hideSidebar: true,
			hideSubBar: false,
			hideRelated: true,
			hideComments: true,
			hidePlaylist: false,
			hideLiveChat: true,
			hideTrending: true,
			hideMerch: true,
			hideNonLists: false,
            hideShorts: true
		},
		disablePlaylists: false,
		applyInstantly: true
	};
}


options = get_default_options();

initiate();
