H5P.Task = (function ($, EventDispatcher) {

  /**
   * Task
   *
   * @class H5P.Task
   * @extends H5P.EventDispatcher
   * @param {string} type
   */
  function Task(type) {
    var self = this;

    // Inheritance
    EventDispatcher.call(this);

    // Register default order
    self.order = ['image', 'introduction', 'content', 'feedback', 'buttons'];

    // Keep track of registered sections
    var sections = {};

    // Buttons
    var buttons = {};
    var buttonOrder = [];

    // Wrapper when attached
    var $wrapper;

    /**
     * Register section with given content.
     *
     * @private
     * @param {string} section ID of the section
     * @param {(string|H5P.jQuery)} content
     */
    var register = function (section, content) {
      var $e = sections[section] = $('<div/>', {
        'class': 'h5p-task-section h5p-task-' + section,
      });
      if (content) {
        $e[content instanceof $ ? 'append' : 'html'](content);
      }
    };

    /**
     * Update registered section with content.
     *
     * @private
     * @param {string} section ID of the section
     * @param {(string|H5P.jQuery)} content
     */
    var update = function (section, content) {
      if (content instanceof $) {
        sections[section].html('').append(content);
      }
      else {
        sections[section].html(content);
      }
    };

    /**
     * Insert element with given the ID into the DOM.
     *
     * @private
     * @param {array} order
     * List with ordered element IDs
     * @param {string} id
     * ID of the element to be inserted
     * @param {Object} elements
     * Maps ID to the elements
     * @param {H5P.jQuery} $container
     * Parent container of the elements
     */
    var insert = function (order, id, elements, $container) {
      // Try to find an element id should be after
      for (var i = 0; i < order.length; i++) {
        if (order[i] === id) {
          // Found our pos
          while (i > 0 && !elements[order[i - 1]].is(':visible')) {
            i--;
          }
          if (i === 0) {
            // We are on top.
            elements[id].prependTo($container);
          }
          else {
            // Add after element
            elements[id].insertAfter(elements[order[i - 1]]);
          }
          break;
        }
      }
    };

    /**
     * Add task image.
     *
     * @param {string} path Relative
     * @param {string} [alt] Text representation
     */
    self.setImage = function (path, alt) {
      sections.image = $('<img/>', {
        'class': 'h5p-task-section h5p-task-image',
        src: H5P.getPath(path, this.contentId),
        alt: (alt === undefined ? '' : alt),
        on: {
          load: function () {
            self.trigger('imageLoaded', this);
          }
        }
      });
    };

    /**
     * Add the introduction section.
     *
     * @param {(string|H5P.jQuery)} content
     */
    self.setIntroduction = function (content) {
      register('introduction', content);
    };

    /**
     * Add the content section.
     *
     * @param {(string|H5P.jQuery)} content
     * @param {string} [extraClass]
     */
    self.setContent = function (content, extraClass) {
      register('content', content);

      if (extraClass) {
        sections.content.addClass(extraClass);
      }
    };

    /**
     * Set feedback message.
     * Setting the message to blank or undefined will hide it again.
     *
     * @param {(string|H5P.jQuery)} [content]
     */
    self.setFeedback = function (content) {
      if (content) {
        if (sections.feedback) {
          // Update section
          update('feedback', content);
        }
        else {
          // Create section
          register('feedback', content);
        }

        if ($wrapper && !sections.feedback.is(':visible')) {
          // Make visible
          insert(self.order, 'feedback', sections, $wrapper);
        }
      }
      else if (sections.feedback) {
        // Remove feedback
        sections.feedback.detach();
      }
    };

    /**
     * Register buttons for the task.
     *
     * @param {string} id
     * @param {string} text label
     * @param {function} clicked
     * @param {boolean} [visible=true]
     */
    self.addButton = function (id, text, clicked, visible) {
      if (buttons[id]) {
        return; // Already registered
      }

      if (sections.buttons === undefined)  {
        // We have buttons, register wrapper
        register('buttons');
      }

      var $e = buttons[id] = $('<button/>', {
        'class': 'h5p-task-button h5p-task-' + id,
        html: text,
        on: {
          click: function () {
            clicked();
          }
        }
      });
      buttonOrder.push(id);

      if (visible === undefined || visible) {
        // Button should be visible
        $e.appendTo(sections.buttons);
      }
    };

    /**
     * Show registered button with given identifier.
     *
     * @param {string} id
     */
    self.showButton = function (id) {
      insert(buttonOrder, id, buttons, sections.buttons);
    };

    /**
     * Hide registered button with given identifier.
     *
     * @param {string} id
     */
    self.hideButton = function (id) {
      var button = buttons[id];

      if (button.is(':focus')) {
        // Move focus to the first visible button.
        sections.buttons.children(':visible:first').focus();
      }

      buttons[id].detach();
    };

    /**
     * Set focus to the given button. If no button is given the first visible
     * button gets focused. This is useful if you lose focus.
     *
     * @param {string} [id]
     */
    self.focusButton = function (id) {
      if (id === undefined) {
        // Find first button and give focus

      }
      else if (buttons[id].is(':visible')) {
        // Set focus to requested button
        buttons[id].focus();
      }
    };

    /**
     * Attach content to given container.
     *
     * @param {H5P.jQuery} $container
     */
    self.attach = function ($container) {
      $wrapper = $container;
      $container.html('').addClass('h5p-task h5p-' + type);

      // Add sections in given order
      for (var i = 0; i < self.order.length; i++) {
        var section = self.order[i];
        if (sections[section]) {
          sections[section].appendTo($container);
        }
      }
    };
  }

  // Inheritance
  Task.prototype = Object.create(EventDispatcher.prototype);
  Task.prototype.constructor = Task;

  return Task;
})(H5P.jQuery, H5P.EventDispatcher);
