# varsub TinyMCE Plugin
> Variable Substitution aka mergetags plugin alternative.

# Features
1. Auto-complete
   > Typing `{{` and type any character to auto complete the variable.
2. Customizable
   - Flexible to write your own pattern for the variable (start `{{` and close `}}` delimiters).
   - Can have inline styling applied.
   - Change the selected variable to any other variable with select of any other menu item.
   - The variable substitution menu can be nested.

**The HTML structure for the Variable Substitution (`varsub`) is as follow:**

```html
<span class="mce-varsub">
  ...
  <span class="mce-varsub-start">{{</span>
    .FirstName
  <span class="mce-varsub-end">}}</span>
  ...
</span>
```

```html
<span class="mce-varsub" data-mce-cef-wrappable="true" data-mce-varsub="1" contenteditable="false">
  <span class="mce-varsub-start" data-mce-varsub-start="">{{</span>
    Client.LastCallDate
  <span class="mce-varsub-end" data-mce-varsub-end="">}}</span>
</span>
```

# API
#### Init Options

```js
tinymce.init({
  selector: 'textarea', // change this value according to your HTML
  plugins: 'varsub',
  toolbar: 'varsub',

  // varsub options
  varsub: {
    start: '{{',
    end: '}}',
    variables: [{
      title: 'First Name',
      value: '.FirstName',
    }, {
      title: 'Learners',
      menu: [{
        title: 'First Name',
        value: '.FirstName'
      }]
    }]
  }
});
```