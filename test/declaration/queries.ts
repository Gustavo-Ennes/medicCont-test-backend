export const createMutation = `
  mutation CreateDeclaration($input: CreateDeclarationInput!) {
    createDeclaration(createDeclarationInput: $input) {
      id
      name
      birthday
      user {
        id
      }
      userId
      year
      declaredAmount
      observation
      createdAt
    }
  }
`;

export const updateMutation = `
  mutation DeclarationUpdate($input: UpdateDeclarationInput!) {
    updateDeclaration(updateDeclarationInput: $input) {
      id
      name
      birthday
      user {
        id
      }
      userId
      year
      declaredAmount
      observation
      createdAt
    }
  }
`;

export const findOneQuery = `
  query Declaration($id: Int!) {
    declaration(id: $id) {
      id
      name
      birthday
      user {
        id
      }
      userId
      year
      declaredAmount
      observation
      createdAt
    }
  }
`;

export const findAllQuery = `
  query Declarations($year: Int!) {
    declarations(year: $year) {
      id
      name
      birthday
      user {
        id
      }
      userId
      year
      declaredAmount
      observation
      createdAt
    }
  }
`;

export const removeMutation = `
  mutation RemoveDeclaration($input: Int!) {
    removeDeclaration(id: $input)  
  }
`;
