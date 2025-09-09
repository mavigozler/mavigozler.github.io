# Specification for the Test Generataor Web App

Will use the browser's excellent HTML-based display and form features
to author and present examinations. There will be an AUTHOR MODE
and PRESENT MODE for that reason.

There will be an HTML page for both modes with appropriate forms.

The browser will interact with Node scripts which interact with the
file system

## AUTHOR MODE

This part of the system will have a 'TestMake.html' UI that interacts with
style components (Tailwind CSS) and attempt to make use of React 19 (initially)

The form should allow the construction of the question. Then it should allow
the construction of the response type. Response types will be:

1. Multiple choice
2. Text fill-in

These will be placed in a testbank. Once a testbank is built, the author can create
tests from the repository of questions created.

### Question Creation

This will make use of a "rich text" editor tool to build the question. The app
then converts the editor content to a YAML format and the rich text will be
stored as LaTeX macros for equations, which may have their own editor

### Testbank Creation

The form must allow for creation of repository or bank for the questions that may belong
to a course of study (chem, biology, physics, etc). All questions created must be
part of a repository/bank. Deletion of a Testbank also means deletion of the questions

### Test Creation

A test can be created by taking existing questions from a repository/bank.
The test will include some header information and the questions. It will also
have the option of creating up to four versions (A, B, C, D) which randomizes
the order of questions and labels the versions.

The test will be styled within the web page within a (div) container. That styled
look can then be printed.

The test will be printable from the browser using a button to create a PDF.

### Version Creation

The system must allow for creating versions as explained in the **Test Creation**
section.

## PRESENT MODE

This part is simpler than the AUTHOR MODE. It provides for the viewing of created
tests and for their selection. It will make use of a "rich text" editor so that
responses can make use of sub- and superscripting (as used in STEM)

## Server-Client Interactions

For the TestMake system, initialization starts with looking for 'App.yaml'
which contains information the application not internally part of the
application. If it find the file, it will configure the information into the
system; if not, it will create an 'App.yaml' file and initialize it.

The client screen must allow for opening, creation, and updating of
testbank files. Displayed testbank files shouldd provide the metadata on these.

A testbank must be selected or created to display the form that is the interface
for the CRUD for questions. Questions will be listed as items with a minimum of
metadata on the questions. The list should be scrollable. Click on an item should
populate another fieldset on the form that is the question detail. The fieldset
should contain elements and controls that change with the type of question that is
selected. The interface must also include controls to create or delete questions
as well.

There must also be a fieldset to CRUD for exams. Users will select questions in
the testbanks to add to exam. Questions cannot be created or edited in the Exam
interface: they can only be added or removed.

## FILES

### App.yaml File

Contains information to initialize the application. It will include paths to
test banks whose locations were last known. The paths are to be removed if the
locations are tested and no longer valid. Notes should be given to the user
about missing paths as well as valid files.

### TestMake.html

This markup file used to bootstrap the AUTHOR mode part of the application.
It contains the root elements that will connect the app with the React functionality
for authoring and managing tests and testbanks

### TestTake.html

This markup file used to bootstrap the PRESENT mode part of the application.
It contains the root elements that will connect the app with the React functionality
for presenting prepared exams

### App.tsx

This TypeScript file contains code that is the main entry point of the
app whether it is to author exams and testbanks or to present them to
students for use.

### index.ts [Server]

This script will start the Express server that will mediate the reading (GET) and
writing (POST) of all data and configurations between file system and the client (browser).

Express will be started on localhost port 5000 and paths (REST) will be defined for
actions to read and write YAML files containing the data.

## REST paths

This lists the paths for GET and POST requests to the Express server and to the
Axios client in the App file.

Express routes:

- /app-yaml  path to App.yaml
- /testbanks/filename
- /exams/filename

## YAML specification

### App.yaml

```yaml
---
routes:
  - GET, "/", "res.send($$home)"
  - GET, "/testbanks", "res.send($$testbanks)"
  - POST, "/", 
  - POST, "/testbanks",
testbanks:
```

### Question YAML

```yaml
qtype: mchoice | text | TF
category: [this will be quite open]
question: "quoted string that could involve LaTeX macros"
choices:   # only present for mchoice type
   - "an array leading off with 'a)' 'b)' etc"
   - "this is another choice"
answer: will be a|b|c|d|e for mchoice, or longer answer for text   
```

### TestBank YAML

```yaml
name:  "Name of Testbank"
items: dd #number of items
lastModified:  a date for last modified
created:  a date for created
categories: this will be a yaml array of categories of questions
```

### Exam|Test YAML

```yaml
name:  "Name of Exam/Test"
course: "course name"
edterm:  "the educational term/semester"
questionCount: dd #number of questions in test
lastModified:  a date for last modified
created:  a date for created
author: string for name of author
versions: # array of versions with their questions
   version:
      name: # will be A, B, C, or D
      questions: # array of Question YAML format
```
