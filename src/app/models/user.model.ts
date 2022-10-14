import { ClaimsListModel } from "./claimsList.model";
import { DependentListModel } from "./dependentList.model";
import { MessageModel } from "./message.model";

export class UserModel{
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    phoneNumber: number;
    panNumber: string;
    address: string;
    email: string;
    password: string;
    memberID: number;
    msgModel: MessageModel;
    _token: string;
    dependentList: DependentListModel;
    claimsList: ClaimsListModel;

    get token() {
        return this._token;
    }
}