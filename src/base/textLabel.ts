// const entityType = 4;
// const textLabels: { textLabel: alt.TextLabel, remoteID: number }[] = [];

// alt.on('worldObjectStreamIn', (object) => {
//   if (object instanceof alt.VirtualEntity) {
//     if (object.getStreamSyncedMeta('entityType') !== entityType)
//       return;

//     const textLabel = new alt.TextLabel(
//       object.getStreamSyncedMeta('text') as string,
//       object.getStreamSyncedMeta('font') as string,
//       object.getStreamSyncedMeta('size') as number,
//       1,
//       object.pos,
//       object.getStreamSyncedMeta('rotation') as alt.Vector3,
//       object.getStreamSyncedMeta('color') as alt.RGBA,
//       0,
//       object.getStreamSyncedMeta('color') as alt.RGBA
//     );
//     textLabel.dimension = object.dimension;
//     textLabel.faceCamera = false;
//     textLabels.push({ textLabel, remoteID: object.remoteID });
//   }
// });

// alt.on('worldObjectStreamOut', (object) => {
//   if (object instanceof alt.VirtualEntity) {
//     if (object.getStreamSyncedMeta('entityType') !== entityType)
//       return;

//     const textLabel = textLabels.find(x => x.remoteID == object.remoteID);
//     if (!textLabel?.textLabel)
//       return;

//     textLabel.textLabel.destroy();
//     textLabels.splice(textLabels.indexOf(textLabel), 1);
//   }
// });