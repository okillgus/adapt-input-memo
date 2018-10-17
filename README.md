# adapt-input-memo

Memory component for adapt learning framework. The **Input-Memo Component** provides a component for saving textinput and displaying it later. There are two modes to go: The readonly-mode will display the memorized text. The other mode will display a textarea where you can write down some notes that you want to memorize. 
You will have to implement the component as many times as you want the Learner to reconsider the given topic. Be sure to fill in the same topic, but different input-ids.



Settings
--------
### Attributes
**_component (string)**: This value must be: `memo`.

**_classes (string)**: CSS class name to be applied to the button's containing div. The class must be predefined in one of the Less files. Separate multiple classes with a space.

**_layout (string)**: This defines the horizontal position of the component in the block. Acceptable values are full, left or right.

**storageName (string)**: Specify the name for a shelf where to put the memos.

**message (string)**: Short message to encourage users where to write down memos.

**display (enum)**: Specify how many saved Memos will be displayed: All (default) or only the one identified in the InputId-Field.

**modus (boolean)**: Specify the mode (readonly or editable) in which the component will be used.

**topic (string)**: Specify the topic for a range of memos.

**topic_complete (string)**: Specify the topic in longer form in order to display it as heading.  

**inputId (string)**: Specify the ID of the textarea for identifying this memo.

**displayTitle (string)**: The title to display above the memo field.

**body (string, optional)**: A message to display before memo is shown.

**instruction** (string): This optional text appears above the component. It is frequently used to
guide the learner’s interaction with the component.

TODO
-----------
Using model-view-structure more efficiently. Next step will be a rewrite of the model and a transfer of function from view to model - for example saveDB.


Limitations
-----------
No known limitations.

-----------
The **Input-Memo Component** is a plugin for the Adapt Framework. [Adapt](https://www.adaptlearning.org) is a free and easy to use e-learning authoring tool that creates fully responsive, multi-device, HTML5 e-learning content using the award-winning Adapt developer framework.
