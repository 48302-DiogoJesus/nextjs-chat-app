import { SafeParseError, SafeParseSuccess, ZodType } from "zod";

/**
 * * Felt the need for this since the zod parsing errors are too nested
 */

export type MySafeParseError = {
  success: false;
  errorMessage: string;
};

export type MySafeParseResult<T> = SafeParseSuccess<T> | MySafeParseError;

export function unwrapErrorMessage(error: SafeParseError<any>) {
  return error.error.issues[0].message;
}

export function mySafeParse<T>(
  zodType: ZodType<T>,
  toParse: any,
): MySafeParseResult<T> {
  const parseRes = zodType.safeParse(toParse);

  if (parseRes.success) {
    return parseRes;
  } else {
    return {
      success: false,
      errorMessage: unwrapErrorMessage(parseRes),
    };
  }
}

export type MyParseError = {
  errorMessage: string;
};

/**
 * @throws MyParseError
 */
export function myParse<T>(
  zodType: ZodType<T>,
  toParse: any,
): T {
  const parseRes = zodType.safeParse(toParse);

  if (parseRes.success) {
    return parseRes.data;
  } else {
    const error: MyParseError = {
      errorMessage: unwrapErrorMessage(parseRes),
    };
    throw error;
  }
}
