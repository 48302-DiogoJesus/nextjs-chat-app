export default function unwrapTrpcError(err: any): string {
  return JSON.parse(err.message)[0].message;
}
