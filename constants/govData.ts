import { User, Role } from '../types';

export const indianStatesAndUTs: string[] = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
];

// Pre-defined government accounts to be seeded into the database.
// Passwords are included for the seeding script but would be managed securely in a real system.

const GOVERNMENT_CERTIFIERS: User[] = [
    {
        id: 'certifier-national-india',
        name: 'National Certifier - India',
        role: Role.Certifier,
        email: 'certifier.india@gov.in',
        password: 'Password@123',
        jurisdictionType: 'Country',
        jurisdictionName: 'India',
    },
    ...indianStatesAndUTs.map(state => {
        const stateId = state.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
        return {
            id: `certifier-${stateId}`,
            name: `Certifier - ${state}`,
            role: Role.Certifier,
            email: `certifier.${stateId}@gov.in`,
            password: 'Password@123',
            jurisdictionType: 'State' as 'State',
            jurisdictionName: state,
        }
    })
];

const REGULATOR_ACCOUNT: User = {
    id: 'regulator-national-india',
    name: 'National Regulator - India',
    role: Role.Regulator,
    email: 'regulator.india@gov.in',
    password: 'Password@123',
    jurisdictionType: 'Country',
    jurisdictionName: 'India',
};

// A single list for the seeding script to iterate over
export const ALL_GOVERNMENT_USERS: User[] = [
    ...GOVERNMENT_CERTIFIERS,
    REGULATOR_ACCOUNT,
];