(function() {
  var tmplHash = _.template($('#tmpl-hash').html());

  var fileContentsEl = $('#file-contents');
  var commitsEl = $('#commits');
  var treeEl = $('#tree');

  var addLinksToHashes = function(text) {
    var addLinkToMatchedText = function(matched, type, hash, name) {
      return type + ' ' + tmplHash({hash: hash, name: name});
    }

    return textWithHashes = text.replace(/(blob|parent|tree) (\w*)(?:(?:\t)(\w+))?/g,
        addLinkToMatchedText);
  }

  var formatLinebreaks = function(text) {
    return text.replace(/\n/g, '<br>');
  }

  // Probably makes sense to do this in addLinksToHashes.
  var stripTree = function(text) {
    return text.
        replace(/.......tree./g, '&#187').
        replace(/.......blob./g, '');
  }

  var cleanAndSetHtml = function(header, text, el, willStripTree) {
    header = header ? '<h2>' + header + '</h2>' : '';
    var html = header + addLinksToHashes(text);
    el.html(willStripTree ? stripTree(html) : html);
  }

  loadHash = function(hash, containerId, nestedTreeEl) {
    var gitObject = gitObjects[hash];

    if(gitObject.contents.slice(1, 7) === 'commit') {
      var treeHash = gitObject.meaning.match(/tree (.*)/)[1];
      var treeMeaning = formatLinebreaks(gitObjects[treeHash].meaning);
      cleanAndSetHtml('Tree', treeMeaning, treeEl, true);
    }

    if(containerId === 'tree' && gitObject.contents.slice(1, 5) === 'tree') {
      if(nestedTreeEl.html() === '') {
        cleanAndSetHtml(null, formatLinebreaks(gitObject.meaning),
            nestedTreeEl, true);
      }
      nestedTreeEl.toggle();
    }
    cleanAndSetHtml('File contents', formatLinebreaks(gitObject.meaning),
        fileContentsEl);
  };

  var commits_html = '';
  _.each(commits, function(commit) {
    commits_html = commits_html + tmplHash({hash: commit}) + '<br>';
  });
  cleanAndSetHtml('Commits', commits_html, commitsEl);
  $(document).on('click', 'a', function(e) {
    var $target = $(e.target);
    loadHash($target.attr('id'), $target.parent().attr('id'), $target.next() );
  });
})();

