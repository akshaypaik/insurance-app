export class APPConstants{
    public static emailReg: RegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    public static passwordReg: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    public static phoneReg: RegExp = /^[0-9]{10}$/;
    public static memberIDReg: RegExp = /^[0-9]{6}$/;
    public static panReg: RegExp = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
}   