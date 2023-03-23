import { TinyMCE } from 'tinymce';

import Plugin, { NewSeparator, SEPARATOR } from '../../main/ts/Plugin';

declare let tinymce: TinyMCE;

Plugin();

const templateVariables = [{
  "code": ".LearnerName",
  "type": "name.fullName",
  "label": "Full Name of Person",
  "examples": ["Abhisek Pattnaik"]
}, {
  "code": ".ProgramType",
  "label": "Type of Program",
  "examples": ["Live activity", "Enduring material"]
}, {
  "code": ".ProgramName",
  "type": "commerce.productName",
  "label": "Name of Program",
  "examples": ["Stroke Coordinator Bootcamp-test"]
}, {
  "code": ".City",
  "type": "address.cityName",
  "label": "Name of City",
  "examples": ["Nagpur", "Bathinda", "Mumbai", "Delhi", "Bangalore"]
}, {
  "code": ".State",
  "type": "address.stateAbbr",
  "label": "Name of State",
  "examples": ["PB", "AS", "RJ", "SK", "TN"]
}, {
  "code": ".StateCityDisplay",
  "label": "Hide/Show City & State",
  "examples": ["none", "block"]
}, {
  "code": ".DateRange",
  "type": "date.betweens",
  "label": "Date Range",
  "format": "MMM dd, yyyy - MMM dd, yyyy",
  "examples": ["Sep 20, 2022 - Sep 30, 2022"]
}, {
  "code": ".DateRangeDisplay",
  "label": "Hide/Show Date Range",
  "examples": ["none", "block"]
}, {
  "code": ".CreditsScored",
  "type": "datatype.float",
  "label": "Any Number as Credit Scores",
  "examples": ["7.00", "6.50"]
}, {
  "code": ".CompletedAt",
  "type": "datatype.datetime",
  "label": "Completion Date",
  "format": "MMM dd, yyyy",
  "examples": ["Sep 16, 2022"]
}, {
  "code": ".CurrentYear",
  "type": "datatype.datetime",
  "label": "Current Year",
  "format": "yyyy",
  "examples": ["2023"]
}, {
  "code": ".CurrentDateTime",
  "type": "datatype.datetime",
  "label": "Current Date & time",
  "format": "MMM dd, yyyy HH:mm:ss",
  "examples": ["Sep 20, 2022 08:36:07"]
}];

function convertTemplateVarToVarSub(templateVariables) {
  const varSubVariables = [];
  const categoryMap = new Map()

  templateVariables.forEach((templateVariable) => {
    const varSubVariable = {
      code: templateVariable.code,
      label: templateVariable.label,
      example: templateVariable.examples,
    };

    let categorized = false;

    if (templateVariable.category || templateVariable.code.toLowerCase().includes("program")) {
      let vars = categoryMap.get(templateVariable.category || "Program")
      if (!Array.isArray(vars)) {
        categoryMap.set(templateVariable.category || "Program", [])
        vars = categoryMap.get(templateVariable.category || "Program")
      }
      vars.push(varSubVariable);
      categorized = true
      // console.log(categoryMap)
    }

    if (templateVariable.category || templateVariable.code.toLowerCase().includes("learner")) {
      let vars = categoryMap.get(templateVariable.category || "Learner")
      if (!Array.isArray(vars)) {
        categoryMap.set(templateVariable.category || "Learner", [])
        vars = categoryMap.get(templateVariable.category || "Learner")
      }
      vars.push(varSubVariable);
      categorized = true
      // console.log(categoryMap)
    }

    if (!categorized) {
      let vars = categoryMap.get("Misc")
      if (!Array.isArray(vars)) {
        categoryMap.set("Misc", [])
        vars = categoryMap.get("Misc")
      }
      vars.push(varSubVariable);
      // console.log(categoryMap)
    }
  });

  const catMapIter = categoryMap.entries()
  for (let next = catMapIter.next(); !next.done; next = catMapIter.next()) {
    const [category, vars] = next.value
    varSubVariables.push({
      code: category,
      label: category,
      items: vars,
    });
  }

  return varSubVariables;
}

const exampleVarSubVariables = [{
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


tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'code varsub',
  toolbar: 'varsub',
  varsub: {
    variables: convertTemplateVarToVarSub(templateVariables),
  }
});

tinymce.on("editorchange", (value) => {
  console.log(value);
})