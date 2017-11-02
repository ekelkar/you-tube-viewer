'use strict';
// Run code when the document is ready to be manipulated, 
$(document).ready(function () {
  console.log('document ready jQuery: ', window.jQuery);

  function addVideoToList(video) {
    console.log(video);
    var thumbnailUrl = youtube.generateThumbnailUrl(video.id.videoId);
    var thumbnailImg = $('<img>');
    thumbnailImg.attr('src', video.snippet.thumbnails.default.url);

    // var thumbnailUrl2 = youtube.generateThumbnailUrl(video.id.videoId);
    // var thumbnailImg2 = $('<img>')
    // thumbnailImg2.attr('src', video.snippet.thumbnails.default.url);

    // var tnailImg = $('<img>');
    // tnailImg.attr('src', video.snippet.thumbnails.default.url);

    // Create a div to put info into
    var videoDiv = $('<div>')
    //videoDiv.append(thumbnailImg);
    thumbnailImg.clone().appendTo(videoDiv)
    videoDiv.append($('<p>' + video.snippet.title + '</p>'));
    console.log('videoDiv: ', videoDiv);
    console.log('tni: ', thumbnailImg)

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

    videoDiv.on('click', function (e) {
      e.preventDefault();
      var videoTitle = $('<h2>');
      videoTitle.html(video.snippet.title);
      var videoEmbed = $('<iframe></iframe>');
      videoEmbed.attr('src', youtube.generateEmbedUrl(video.id.videoId));
      videoEmbed.attr('width', 560);
      videoEmbed.attr('height', 318);

      var videoWatcher = $('#video-watcher');
    // videoWatcher.hide();  // hide the matched elements
    // remove all child nodes of the set of matched elements from the DOM
    videoWatcher.empty(); 
      videoWatcher.append(videoTitle);
     videoWatcher.append(videoEmbed);
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

  // change the query variable to try to get different results from the API
  // var query = "Tie+Dye";

  function queryYouTube(searchStr) {
    $.ajax({
      type: "GET",
      url: "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" +
      searchStr + "&type=video&key=" + youTubeKey,
      dataType: "json",
      success: function (result) {
        for (var i = 0; i < result.items.length; i++) {
          addVideoToList(result.items[i]);
        }
      }
    });
  };

  function emptyVideoList() {
    // Remove any videos currently in the list.
    // This works by removing all child nodes of the set of 
    //   matched elements from the DOM.
    $('#videos-list').empty();
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
    // Do not let the event actually fire, form does not execute and
    //   page does not refresh.
    // return false;
  });

    $('#searchForm').submit(function (event) {
    // When a value is input to search for and return is entered, this 
    //   causes the form submit event to fire. This code is needed to
    //   ignore the default actions and handle the return as a keyup
    //   event causing a request to be submitted to the YouTube API.
        console.log('handle submit')
        event.preventDefault();
        // return false;
    });

  $('#search').on('click', function (event) {
    event.preventDefault();
    let searchStr = $('#searchFor').val();
    submitQueryRequest(searchStr);
  });

  // change the query variable to try to get different results from the API
//   var query = "Tie+Dye";
//   queryYouTube(query);

  console.log('you tube key:', youTubeKey);
});
