/* eslint-env jquery */ // Enables eslint for jquery
'use strict';
// Run code when the document is ready to be manipulated, 
$(document).ready(function () {
  console.log('document ready jQuery: ', window.jQuery);

  function createVideoImgElement (video) {
    let thumbnailImg = $('<img>');
    thumbnailImg.attr('src', video.snippet.thumbnails.default.url);
    return thumbnailImg;
  }

  function createVideoHeadingElement(video) {
    return $('<h5>' + video.snippet.title + '</h5>');
  }

  function addVideoToList(video) {
    console.log(video);

    // var thumbnailUrl2 = youtube.generateThumbnailUrl(video.id.videoId);
    // var thumbnailImg2 = $('<img>')
    // thumbnailImg2.attr('src', video.snippet.thumbnails.default.url);

    // var tnailImg = $('<img>');
    // tnailImg.attr('src', video.snippet.thumbnails.default.url);

    // Create a div to put info into
    let videoDiv = $('<div>');

    // Add the image element and the heading
    videoDiv.append(createVideoImgElement(video));
    videoDiv.append(createVideoHeadingElement(video));

    // Create a list element
    let videoListItem = $('<li>');

    // Add the div with image and heading to the list item element
    videoListItem.append(videoDiv);

    // Add these to the videos-list element
    $('#videos-list').append(videoListItem);

    //     var videoDiv2 = $('<div>');
    //     videoDiv2.attr('class', 'thumbnail')
    //     videoDiv2.append(thumbnailImg);
    //     console.log('videoDiv2:', videoDiv2);
    //     console.log('videoDiv: ', videoDiv);
    //     console.log('tni2: ', thumbnailImg)
    //     var card = `
    //   <div class="thumbnail">
    //     <img src="${video.snippet.thumbnails.default.url}"/> 
    //     <div class="caption" style="overflow: hidden;">
    //       <h4>${video.snippet.title}</h4>
    //       <p>${video.snippet.description} </p>
    //     </div>
    //   </div>`
    //     console.log('card: ', card)

    // var captionDiv = $('<div>');
    // captionDiv.attr('class', 'caption');
    // captionDiv.append($('<h4>' + video.snippet.title + '</h4>'));
    // captionDiv.append($('<p>' + video.snippet.description + '</p>'));
    // videoDiv2.append(captionDiv);

    videoDiv.on('click', function (event) {
      function createVideoEmbedElement (video) {
        let videoEmbedElement = $('<iframe></iframe>');
        videoEmbedElement.attr('src', youtube.generateEmbedUrl(video.id.videoId));
        videoEmbedElement.attr('width', 560);
        videoEmbedElement.attr('height', 318);
        return videoEmbedElement
      }

      event.preventDefault();
      let videoTitle = $('<h2>');
      videoTitle.html(video.snippet.title);

      var videoWatcher = $('#video-watcher');
      // videoWatcher.hide();  // hide the matched elements
      // remove all child nodes of the set of matched elements from the DOM
      videoWatcher.empty();
      videoWatcher.append(videoTitle);
      videoWatcher.append(createVideoEmbedElement(video));
      videoWatcher.show();
      // videoWatcher.fadeIn(); // display the matched elements by fading them to opaque
    });

    var videoItem = $('<li>');
    console.log('videoDiv: ', videoDiv);
    videoItem.append(videoDiv);
    $('#videos-list').append(videoItem);

    // var videoItem2 = $('<li>');
    // videoItem2.append(videoDiv2);
    // $('#videos-list2').append(videoItem2);

    // var videoItem3 = $('<li>');
    // videoItem3.append(card);
    // $('#videos-list3').append(videoItem3);
  }

  function queryYouTube(searchStr) {
    $.ajax({
      type: "GET",
      url: "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" +
      searchStr + "&type=video&key=" + youTubeKey,
      dataType: "json",
      success: function (result) {
        for (var i = 0; i < result.items.length; i++) {
          addVideoToList(result.items[i]);
          // addVideoToList2(result.items[i]);
          // addVideoToList3(result.items[i]);
        }
      }
    });
  };

  function emptyVideoList() {
    // Remove any videos currently in the list.
    // This works by removing all child nodes of the set of 
    //   matched elements from the DOM.
    // Also hide the video viewer.
    $('#videos-list').empty();
    $('#video-watcher').hide();
  };

  function submitQueryRequest(searchStr) {
    console.log('search for "%s"', searchStr);
    emptyVideoList();
    queryYouTube(searchStr);
  }

  $('#searchFor').on("keyup", function (event) {
    console.log('keyCode:', event.which)
    if (event.which === 13) {
      event.preventDefault();
      let searchStr = $('#searchFor').val()
      submitQueryRequest(searchStr);
    };
  });

  $('#searchForm').submit(function (event) {
    // When a value is input to search form and return is entered, this
    //   causes the form submit event to fire. This code is needed to
    //   ignore the default actions and handle the return as a keyup
    //   event causing a request to be submitted to the YouTube API.
    console.log('handle submit')
    event.preventDefault();
   });

  $('#search').on('click', function (event) {
    event.preventDefault();
    let searchStr = $('#searchFor').val();
    submitQueryRequest(searchStr);
  });

   console.log('you tube key:', youTubeKey);
});
