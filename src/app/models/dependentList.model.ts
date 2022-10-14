import { DependentModel } from "./dependent.model";
import { MessageModel } from "./message.model";

export class DependentListModel{
    dependents: Array<DependentModel>;
    msgModel: MessageModel;
}