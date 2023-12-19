import {
  ParameterReflection,
  ProjectReflection,
  ReferenceType,
  SignatureReflection,
} from "typedoc"
import { Parameter } from "../types"
import {
  GetReflectionTypeParametersParams,
  getReflectionTypeParameters,
} from "./reflection-type-parameters"

const MUTATION_PARAM_TYPE_NAME = "UseMutationOptions"
const MUTATION_RETURN_TYPE_NAME = "UseMutationResult"
const QUERY_PARAM_TYPE_NAME = "UseQueryOptionsWrapper"
const BLACKLISTED_PARAM_NAMES = ["constructor", "void"]

export function isReactQueryMutation(
  signatureReflection: SignatureReflection
): boolean {
  return (
    signatureReflection.type?.type === "reference" &&
    signatureReflection.type.name === MUTATION_RETURN_TYPE_NAME
  )
}

export function getReactQueryQueryParameterType(
  signatureReflection: SignatureReflection
): ReferenceType | undefined {
  let parameterType: ReferenceType | undefined
  signatureReflection.parameters?.some((parameter) => {
    if (
      parameter.type?.type === "reference" &&
      parameter.type.name === QUERY_PARAM_TYPE_NAME
    ) {
      parameterType = parameter.type
      return true
    }

    return false
  })

  return parameterType
}

export function isReactQueryQuery(
  signatureReflection: SignatureReflection
): boolean {
  return getReactQueryQueryParameterType(signatureReflection) !== undefined
}

/**
 * Some parameter types are declared as classes which shows their constructor as
 * an accepted parameter. This removes the constructor from the list of parameters.
 */
export function cleanUpParameterTypes(parameters: Parameter[]): Parameter[] {
  return parameters.filter(
    (parameter) => !BLACKLISTED_PARAM_NAMES.includes(parameter.name)
  )
}

export function getHookParams(
  signatureReflection: SignatureReflection
): ParameterReflection[] {
  let hookParameters: ParameterReflection[] = []
  if (isReactQueryMutation(signatureReflection)) {
    /**
     * check parameters before the options parameter having the {@link MUTATION_PARAM_TYPE_NAME} type
     */
    hookParameters =
      signatureReflection.parameters?.filter((parameter) => {
        return (
          parameter.type?.type !== "reference" ||
          parameter.type.name !== MUTATION_PARAM_TYPE_NAME
        )
      }) || []
  } else if (isReactQueryQuery(signatureReflection)) {
    /**
     * check parameters before the options parameter having the {@link QUERY_PARAM_TYPE_NAME} type
     */
    hookParameters =
      signatureReflection.parameters?.filter((parameter) => {
        return (
          parameter.type?.type !== "reference" ||
          parameter.type.name !== QUERY_PARAM_TYPE_NAME
        )
      }) || []
  }

  return hookParameters
}

type GetMutationParamsParams = {
  signatureReflection: SignatureReflection
  project: ProjectReflection
  reflectionTypeGetterOptions?: Partial<GetReflectionTypeParametersParams>
}

export function getMutationParams({
  signatureReflection,
  reflectionTypeGetterOptions,
  project,
}: GetMutationParamsParams): Parameter[] {
  let mutationParameters: Parameter[] = []
  if (isReactQueryMutation(signatureReflection)) {
    const mutationOptionParam = signatureReflection.parameters?.find(
      (parameter) => {
        return (
          parameter.type?.type === "reference" &&
          parameter.type.name === MUTATION_PARAM_TYPE_NAME
        )
      }
    )

    if (
      mutationOptionParam?.type &&
      mutationOptionParam.type.type === "reference" &&
      (mutationOptionParam.type.typeArguments?.length || 0) >= 3
    ) {
      mutationParameters = cleanUpParameterTypes(
        getReflectionTypeParameters({
          ...reflectionTypeGetterOptions,
          reflectionType: mutationOptionParam.type.typeArguments![2],
          project: project,
        })
      )
    }
  }

  return mutationParameters
}

export function hasResponseTypeArgument(type: ReferenceType): boolean {
  return (
    (type.typeArguments?.length || 0) >= 1 &&
    type.typeArguments![0].type === "reference" &&
    type.typeArguments![0].name === "Response" &&
    (type.typeArguments![0].typeArguments?.length || 0) >= 1
  )
}

type GetMutationReturnParams = GetMutationParamsParams

export function getMutationReturn({
  signatureReflection,
  reflectionTypeGetterOptions,
  project,
}: GetMutationReturnParams): Parameter[] {
  let returnParams: Parameter[] = []
  if (!isReactQueryMutation(signatureReflection)) {
    return returnParams
  }

  const returnType = signatureReflection.type! as ReferenceType

  if (hasResponseTypeArgument(returnType)) {
    returnParams = cleanUpParameterTypes(
      getReflectionTypeParameters({
        ...reflectionTypeGetterOptions,
        reflectionType: (returnType.typeArguments![0] as ReferenceType)
          .typeArguments![0],
        project,
      })
    )
  }

  return returnParams
}

type GetQueryReturnParams = GetMutationParamsParams

export function getQueryReturn({
  signatureReflection,
  reflectionTypeGetterOptions,
  project,
}: GetQueryReturnParams): Parameter[] {
  let returnParams: Parameter[] = []

  const parameterType = getReactQueryQueryParameterType(signatureReflection)

  if (parameterType && hasResponseTypeArgument(parameterType)) {
    returnParams = cleanUpParameterTypes(
      getReflectionTypeParameters({
        ...reflectionTypeGetterOptions,
        reflectionType: (parameterType.typeArguments![0] as ReferenceType)
          .typeArguments![0],
        project,
      })
    )
  }

  return returnParams
}
