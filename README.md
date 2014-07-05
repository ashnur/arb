I think the original idea ( using Uint16Array heap for bigits, which is maintained a linked list typedarray) is viable, but currently the alloc/free part poses a serious block. It seems to me that any kind of free() at runtime hinders performance too much. 

I see two possible solutions to this.

- some kind of async free which doesn't conflict with alloc()
- using a stack for internal values and reimplementing the operations to work on that
  this would help because free() on a stack is very fast


also, if I could remove the set to 0 from free, and write the operations to not expect chunks/bigits set to 0, that would possible help a bit with the performance too.
