## Unsequenced ⏲

___Todo/Inventory___

**Cases/Needs**
* [x] When adding Task Block ensure name is unique, and consists of valid characters (non-space).
* [x] For Task edits, check to see if a change has been made.
* [x] CTA for no Task Blocks.
* [x] Change task time to value less than completed. Right now, if we go from ```30 min of 50 min complete```, to a total of 20 min it will be ```30 min of 20 min complete```, which is impossible.
* [ ] A way to reset a timer that is partially completed.
* [ ] Swipe to delete for Tasks
* [ ] Close swipe on Task Blocks if another action (edit/add Task Block) is initiated.
* [x] Convert Create New Task Block button to a plus (+) sign.
* [ ] Sounds
* [ ] Logic for playing.
* [ ] Figure our testing for useFocusEffect.

----
|  Screens  | UI  | Logic  | | Sub-Screens  | UI  | Logic  |
| :----- | :-----: | :-----: | :------- | :------| :------: | :------: |
| Task Blocks  | ✓  | ✓ || Edit Task Block  | ✓ | ✓ |
| Create New Task Block  | ✓ | ✓  || Edit Task Block > Confirm Delete  | ✓ | ✓ |
|  Now Playing  | ✓  | ✓ ||  Add Task  | ✓ | ✓ |
|  Settings: *Light/Dark Mode*  |  ✓ | ✓ || Edit Task |  ✓  | ✓ |
|  Settings: *Quiet Mode* |  ✓ | ✓ || Delete Task | ✓  | ✓  |
||||											 | Duplicate Task | ✓| ✓|
||||											 | Mark Task Complete | ✓| ✓|
||||                       | Reset Time For Task |  |  |
||||                       | Swipe To Delete Task | ✓ |  |

| Component | Complete |
| :--------  | :------:|
| Color key for light/dark mode - font styling | ✓ |
| Swipeable for Task Block | ✓ |
| Swipeable/Draggable for Tasks | ✓ |
| Round Buttons - Now Playing | ✓ |
| Progress Bar - Now Playing | ✓ |
| Progress Bar on Task Bars | ✓ |
| Timer for Tasks |  |
| Activity Loaders |  |
| Connection to SQLite |  |


