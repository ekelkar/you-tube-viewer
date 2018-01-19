'use strict';
// Run code when the document is ready to be manipulated, 
$(document).ready(function () {
  console.log('document ready jQuery: ', window.jQuery);

  function handleVideoClick (event) {

    function createVideoEmbedElement () {
      let videoEmbedElement = $('<iframe></iframe>');
      let videoId = $(event.currentTarget).attr('data-video-id');

      videoEmbedElement.attr('src', youtube.generateEmbedUrl(videoId));
      videoEmbedElement.attr('class', 'embed-responsive-item');

      return videoEmbedElement;
    }

    event.preventDefault();
    location.href = '#video-watcher';
    var videoWatcher = $('#video-watcher');
    videoWatcher.empty();
    videoWatcher.append(createVideoEmbedElement());
    videoWatcher.show();
  }

  function createVideoDiv (video) {
    let videoDiv = $('<div>');

    videoDiv.attr('data-video-id', video.id.videoId);
    videoDiv.attr('data-video-title', video.snippet.title);
    videoDiv.attr('class', 'col-sm-4');
    videoDiv.attr('style', 'height: 100%;');

    return videoDiv;
  }

  function createVideoRow (videos) {
    let rowDiv = $('<div>');

    rowDiv.attr('class', 'row');
    // videoDiv.attr('style', 'height: 100%;');
    videos.forEach(video => {
      rowDiv.append(addVideoDiv(video));
    });

    return rowDiv;
  }

  function addVideoDiv(video) {
    console.log(video);

    let videoDiv = createVideoDiv(video);
    // videoDiv.attr('class', 'thumbnail');

    let cardBody = `
    <div class="thumbnail">
      <img src="${video.snippet.thumbnails.default.url}" alt="Card image"/>
      <div class="caption" style="overflow: hidden;">
        <h4>${video.snippet.title}</h4>
        <p>${video.snippet.description} </p>
      </div>
    </div>`;

    videoDiv.append(cardBody);

    // Add these to the videos-list element
    $('#videos-list').append(videoDiv);

    videoDiv.on('click', handleVideoClick);
  }

  function queryYouTube(searchStr) {
    let youTubeUrl = [
      'https://www.googleapis.com/youtube/v3/search',
      '?part=snippet',
      '&q=', searchStr,
      '&type=video',
      '&key=', youTubeKey];
      // .join('');

    if (nextPageToken !== '') {
      youTubeUrl.push('&pageToken=' + nextPageToken);
    }

    $.ajax({
      type: "GET",
      url: youTubeUrl.join(''),
      dataType: "json",
      success: function (result) {
        for (let i = 0; i < result.items.length; i = i + 3) {
          $('#videos-list').append(createVideoRow(result.items.slice(i, i + 3)));
        }
        nextPageToken = result.nextPageToken;
        $('#more').show();
      }
    });
  }

  function emptyVideoList() {
    // Remove any videos currently in the list.
    // This works by removing all child nodes of the set of 
    //   matched elements from the DOM.
    // Also hide the video viewer.
    $('#videos-list').empty();
    $('#video-watcher').hide();
  }

  function submitQueryRequest(searchStr) {
    console.log('search for "%s"', searchStr);
    emptyVideoList();
    queryYouTube(searchStr);
  }

  let nextPageToken = '';

  $('#searchFor').on("keyup", function (event) {
    console.log('keyCode:', event.which);
    if (event.which === 13) {
      event.preventDefault();
      let searchStr = $('#searchFor').val();
      submitQueryRequest(searchStr);
    }
  });

  $('#searchForm').submit(function (event) {
    // When a value is input to search form and return is entered, this
    //   causes the form submit event to fire. This code is needed to
    //   ignore the default actions and handle the return as a keyup
    //   event causing a request to be submitted to the YouTube API.
    console.log('handle submit');
    event.preventDefault();
   });

  $('#search').on('click', function (event) {
    event.preventDefault();
    let searchStr = $('#searchFor').val();
    submitQueryRequest(searchStr);
  });

  $('#more-btn').on('click', function (event) {
    console.log('more');
    // event.preventDefault();
    let searchStr = $('#searchFor').val();
    submitQueryRequest(searchStr);
  });

  $('.btn').mouseup(function() {
    this.blur();
  });

   console.log('you tube key:', youTubeKey);
});
