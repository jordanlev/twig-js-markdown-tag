  var marked = required('marked');

  function twigMarkdownExtension(Twig) {
    Twig.exports.extendTag({
      type: "markdown",
      regex: /^markdown$/,
      next: ["endmarkdown"],
      open: true,
      parse: function (token, context, chain) {
        var output = Twig.parse.apply(this, [token.output, context]);

        var indentation = output.match(/^\s*/);
        indentation = (indentation && indentation.length) ? indentation[0] : '';
        if (indentation.length) {
          var lines = output.split(/\r?\n/);
          var regex = new RegExp('^' + indentation);
          for (var i = 0, len = lines.length; i < len; i++) {
            lines[i] = lines[i].replace(regex, '');
          }
          output = lines.join("\n");
        }

        output = marked(output);

        return {
          chain: chain,
          output: output
        };
      }
    });

    Twig.exports.extendTag({
      type: "endmarkdown",
      regex: /^endmarkdown$/,
      next: [ ],
      open: false
    });
  }
