/*
const updateEntityInState = (state: AppState, entity: EntityDto): AppState => {
  const { type, id, ...changes } = entity;
  const adapter = entityConfig[type].adapter;
  const updatedState = adapter.updateOne({ id, changes }, state[type]);

  // Recursively add child entities
  entity.childNodes.forEach(child => {
    state = updateEntityInState(state, child);
  });

  return {
    ...state,
    [type]: updatedState
  };
};

*/
