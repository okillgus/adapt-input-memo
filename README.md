# adapt-memo

Memory component for adapt learning framework.

The **Memo Component** provides a component for taking notes, saving them and displaying the textinput later.

Mode 1 will display a textarea where you can write down some notes that you want to memorize. 
Mode 2 will display the memorized text.

Settings
--------
### Attributes
**_component (string)**: This value must be: `memo`.

> **mode (number)**: Specify the mode in which the component will be used.

> **_topic (string)**: Specify the topic for a range of memos.

> **_inputId (string)**: Specify the ID of the textarea for identifying this memo.

> **displayTitle (string)**: The title to display above the memo field.

> **body (string, optional)**: A message to display before memo is shown.

> **_classes (string)**: CSS class name to be applied to the button's containing div. The class must be predefined in one of the Less files. Separate multiple classes with a space.

> **_layout (string)**: This defines the horizontal position of the component in the block. Acceptable values are full, left or right.


Limitations
-----------
No known limitations.

-----------
The **Memo Component** is a plugin for the Adapt Framework. [Adapt](https://www.adaptlearning.org) is a free and easy to use e-learning authoring tool that creates fully responsive, multi-device, HTML5 e-learning content using the award-winning Adapt developer framework.
