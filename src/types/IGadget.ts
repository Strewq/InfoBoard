import IWithName from "./IWithName";
import IWithTags from "./IWithTags";
import ITypedSerializable from "./ITypedSerializable";
import IIdentifiable from "./IIdentifiable";

export default interface IGadget extends IWithName, IWithTags, ITypedSerializable, IIdentifiable {}