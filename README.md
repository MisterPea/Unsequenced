## Unsequenced - v1.1.1 ⏲
#### A Pomodoro technique-inspired app for the iPhone. 
----

Currently in Beta-testing.<br />
If you're interested in trying it out, you can download the app with [this forthcoming link](#) via TestFlight.

This app looks to provide users with a way to organize time associated with tasks.<br />
As creators, we are all prone to spending too much time on one facet of our work-day, while neglecting others. This app will allow you to set time limits and breaks for anything you wish to accomplish.

----
___Todo/Inventory___

**Cases/Needs**
* [x] When adding Task Block ensure name is unique, and consists of valid characters (non-space).
* [x] For Task edits, check to see if a change has been made.
* [x] CTA for no Task Blocks.
* [x] Change task time to value less than completed. Right now, if we go from ```30 min of 50 min complete```, to a total of 20 min it will be ```30 min of 20 min complete```, which is impossible.
* [x] A way to reset a timer that is partially completed.
* [ ] Swipe to delete for Tasks
* [x] Close swipe on Task Blocks if another action (edit/add Task Block) is initiated.
* [x] Convert Create New Task Block button to a plus (+) sign.
* [x] Notifications for completion
* [x] Logic for playing.
* [ ] -Android- Grey screen on modal - need to fix.
* [ ] -Android- Add/Edit task - buttons not showing on dark mode - flashing hidden content
* [ ] Figure out testing for useFocusEffect.
* [x] Update total time on Task Block when automatic task breaks are added.


----
|  Screens  | UI  | Logic  | | Sub-Screens  | UI  | Logic  |
| :----- | :-----: | :-----: | :------- | :------| :------: | :------: |
| Task Blocks  | ✓  | ✓ || Edit Task Block  | ✓ | ✓ |
| Create New Task Block  | ✓ | ✓  || Edit Task Block > Confirm Delete  | ✓ | ✓ |
|  Now Playing  | ✓  | ✓ ||  Add Task  | ✓ | ✓ |
| Settings: *Light/Dark Mode*  |  ✓ | ✓ || Edit Task |  ✓  | ✓ |
| Settings: *Quiet Mode* |  ✓ | ✓ || Delete Task | ✓  | ✓  |
| Settings: *Show Notifications*|✓|✓|											 | Duplicate Task | ✓| ✓|
| Settings: *Allow Sounds* |✓|✓|											 | Mark Task Complete | ✓| ✓|
| Settings: *About Me*  |||                       | Reset Time For Task | ✓| ✓|
||||                       | Swipe To Delete Task | ✓ |  |
||||                        | Notifications - While App is Active | ✓| ✓|
||||                        | Notifications - While App is in Background | ✓ | ✓|
||||                        | Automatically Add/Remove Task Breaks | n/a| ✓|

| Component | Complete |
| :--------  | :------:|
| Color key for light/dark mode - font styling | ✓ |
| Swipeable for Task Block | ✓ |
| Swipeable/Draggable for Tasks | ✓ |
| Round Buttons - Now Playing | ✓ |
| Progress Bar - Now Playing | ✓ |
| Progress Bar on Task Bars | ✓ |
| Timer for Tasks | ✓ |
| Async Storage | ✓ |
| Loading Screen * - *might have to revisit* |✓|


