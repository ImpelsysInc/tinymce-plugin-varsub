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
<span class="varsub" contenteditable="false" data-mce-cef-wrappable="true" data-varsub="1"
      data-varsub-example="Abhisek Pattnaik" data-mce-selected="1">
  <span class="varsub-start" data-varsub-start="{{">{{</span>
  <span class="varsub-var" data-varsub-var=".LearnerName"
        data-varsub-example="Abhisek Pattnaik">.LearnerName</span>
  <span class="varsub-end" data-varsub-end="}}">}}</span>
</span>
```

# API
#### Init Options

```js
tinymce.init({
  selector: 'textarea', // change this value according to your HTML
  external_plugins: {
      // v1.0.0
      varsub: "https://cdn.jsdelivr.net/gh/ImpelsysInc/tinymce-plugin-varsub@v1.0.0/dist/varsub/plugin.min.js"

      // latest
      // varsub: "https://cdn.jsdelivr.net/gh/ImpelsysInc/tinymce-plugin-varsub@master/dist/varsub/plugin.min.js"
  },
  toolbar: 'varsub',

  // varsub options
  varsub: {
    start: '{{',
    end: '}}',
    variables: [{
      code: "Secondary Email",
      example: "secondaryEmail@example.com",
      items: [
        {
          example: 1,
          code: ".Number"
        },
        SEPARATOR,
        {
          code: ".FirstName",
          label: "First Name",
          example: ["Abhisek", "Ashik"]
        },
        NewSeparator("First Name"),
        {
          code: ".LastName",
          label: "Last Name",
          example: ["Pattnaik", "Kumar"]
        },
        "SEPARATOR",
      ],
    }]
  }
});
```