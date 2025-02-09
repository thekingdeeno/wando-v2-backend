type RegisterUserDto = {
    firstName: string;
    lastName: string;
    email: string
    phoneNumber: string;
    age: number;
    nationality: number;
    userName: string;
    gender: 'male' | 'female';
    institution: string;
    institutionType: string;
};

export default RegisterUserDto;