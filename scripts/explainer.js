H5P.Question.Explainer = (function ($, EventDispatcher) {
  /**
   * Constructor
   *
   * @class
   * @param {string} title
   * @param {array} explanations
   */
  function Explainer(title, explanations) {
    var self = this;

    /**
     * Create the DOM structure
     */
    var createHTML = function () {
      self.$explanation = $('<div>', {
        'class': 'h5p-question-explanation-container',
        'aria-hidden': true
      });

      // Add title:
      $('<div>', {
        'class': 'h5p-question-explanation-title',
        role: 'heading',
        text: title,
        appendTo: self.$explanation
      });

      var $explanationList = $('<ul>', {
        'class': 'h5p-question-explanation-list',
        tabIndex: 0,
        appendTo: self.$explanation
      });

      for (var i = 0; i < explanations.length; i++) {
        var feedback = explanations[i];
        var content = '<div class="h5p-question-explanation-status">';

        if (feedback.correct) {
          content += '<span class="h5p-question-explanation-correct">' + feedback.correct + "</span>";
        }
        if (feedback.wrong) {
          content += '<span class="h5p-question-explanation-wrong">' + feedback.wrong + "</span>";
        }
        content += '</div>';
        if (feedback.text) {
          content += '<div class="h5p-question-explanation-text">' + feedback.text + "</div>";
        }


        $('<li>', {
          'class': 'h5p-question-explanation-item',
          html: content,
          appendTo: $explanationList
        });
      }
    }

    createHTML();

    /**
     * Return the container HTMLElement
     *
     * @return {HTMLElement}
     */
    self.getElement = function () {
      return self.$explanation;
    }
  }

  return Explainer;

})(H5P.jQuery, H5P.EventDispatcher);
