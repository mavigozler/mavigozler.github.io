# Specification for Building System

## Files Used
- building.json
    contains the names and other hard data
- building.ps1
    the script that reads in 'building.json' for its tasks and executes them
    
## Building.json
This file is the configuration with the following structure:

  *Definitions*

  This is an object that provides names to the values of strings, numbers, booleans, or objects utilized by the system in the `Task` specifications/definitions. It is not required, but makes system organization more compartmentalized and readable/understandable.

  *Tasks*

  An array whose elements are arranged in order of processing for the entire script. The elements are `Task` object definitions which are specified in the next section below.

## Task Type Definition
Each element of the array `Tasks` is a `Task` type. The following properties are a specified with the property type and value and the desciption of the value and what content, whether values are fixed or dynamic

- **title**: [required for all task defs] should be a short string that is descriptive of what the task is doing, like "clean gh-pages directory" or "compile ts files" or "Copy base files"
- **action**: [required for all task defs] a string limited to the set:
    -- "delete"
    -- "run"
    -- "copy"
These are actions taken during a build process.
- **target**: specified for "delete" actions, it is required parameter that specifies the valid path/file for the item(s) to be deleted
- **dryrun**: this is an optional parameter with boolean value is for "delete" and "copy" actions; it works by passing the -WhatIf switch to PowerShell, and the output from PS generates a line or list of the action taken if executed actually, rather than doing the execution.
- **executable**: for the "run" action, this specifies an executable program to run. This will be combined with a required "arguments" property in the task
- **arguments**: a property for a run-type task, this is an array of strings for arguments that are to be passed to executable. The elements of the arguments array should be in the order understood by the executable
- **copydef**: This should refer to the name that is the property in the Definitions object/part of building.json file. The structure of the `copydef` is specified below.
- **options**: currently specified for the 'copy' action type, it is an array of strings of options that can be done for the copy action. Currently on an 'updateonly' option is available
    -- **updateonly**: this informs the 'copy' action function only to copy those items who last modification date is after the date of the current item. Note that copying items of the same name/hash will cause an overwrite of the target

## Actions
In this section, actions that are tasks are detailed

### delete
The delete action can remove a single file (directory item), multiple files (directory items), a directory (an item of a containing directory) along with everything in that directory as a tree. The action effectively uses the `Remove-Item` cmdlet in PowerShell, which will be composed programmatically depending on the setting of the `target` property. The `target` property is essentially to used to set the `-Path` parameter of `Remove-Item`. Here are examples of the values of `target`:
- '/path/to/file': deletes a single file
- '/path/to/directory': deletes the directory and all items in it
- '/path/to/directory/**': deletes all items in the directory (files, subfolders) but not directory
- '/path/to/directory/*: deletes only files in the directory, does not affect subfolders
- '/path/to/directory/*.com: shows use of wildcard characters to delete specific file items; the characters should be used in the customary way to achieve specific deletion

If `dryrun` is set to true, the PowerShell switch parameter `-WhatIf` will be applied and the output reported back without doing any actual deletion.
  
### run
The run action takes the value of `executable` and `arguments` to construct a command that puts the execution to work in PowerShell.

### copy
The copy action task looks for the property `copydef` which can specify one or more items in the file system to copy, from a source to a destination, which are `fsysloc` types. An `fsysloc` type has two properties, `dirpath` and `file`. For each fsysloc type in the copydef, the process will confirm that `dirpath` is the valid path to a directory for both source and destination. The value of `file` will then be added on to `dirpath` in analyzing the source.

- The `source` property of the `copyspec` will be a `fsysloc` type that should specify one or more items (files, subddirectories) that exist for a copy operation to be at all possible. If the source property does not resolve any items, it will evaluate to null and no copy operation will occur, with a message indicating that.
    - The `dirpath` property of `fsysloc` type should be an existing directory. If it is not, the `source` property will be `null` and no copy operation will occur
    - The `file` property can have the following values:
      - if it is `null` or the empty string `""`, and `dirpath` exists, then the directory itself and its items as a tree will be copied to the destination, if valid
      - if the value is the wildcard global `*`, then only the items (tree) of the directory and not the directory itself are copied
      - if the value is a string that with no wildcard characters, it will copy a single item (file or subdirectory) if it corresponds with a valid/existing name of a file or directory.
      - if the value is a string containing wildcard characters, it will copy one or more items present in the directory that match the pattern specified in the string.
- The `destination` property of the `copyspec` type will be an `fsysloc` with `dirpath` and `file`. 

## Types
* **task**   
this type has been defined/detailed in the Task Type Definition section
* **copydef**   
This is array of `copyspec` objects. When passed to a "copy" task (a task object with property "action" set to "copy"), The task will execute copying on each element (copy task) in the order of the elements in the `copydef` array.
* **copyspec**  
This is an object that specifies the information necessary to copy one item from its source location to a destination location. The object has a "source" and "destination" property, which are `fsysloc` types
* **fsysloc**   
This represents a [f]ile [sys]tem [loc]ation, which are typically defined by a path. A fully qualified path is all the directories (folders) from the root directory / folder, which would include a drive specifier if it is part, to the name of the file, which would include a root name and file type identifier ("extension"). The `fsysloc` used here has two properties:
* **dirpath**   
this is the path that only involves directories from the root directory (fully qualified), and should be absolute, not relative, with no use of wildcard specifiers.
* **file**  
this will be a file name referencing a single file. Wildcard characters are allowed, but within the constraints of a parent type that will contain the `fsysloc` type, such as the `copyspec`  type (see it for constraints).
