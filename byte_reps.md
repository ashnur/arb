# Nat
type    | length  | value
0       | 2^16    | list of 2^16 chunks

# Int
type          | length  |  value
1 - negative  | 2^16    |  list of 2^16 chunks


# Fra
type    | numerator | denominator
10      | Nat       | Nat

# Rat
type    | numerator | denominator
11      | Int       | Int


# PNat
type    | dim count | dim lengths   | value
100     | 256       | list of 2^32  | list of Nats

# PInt
type    | dim count | dim lengths   | value
101     | 256       | list of 2^32  | list of Ints

# PFra
type    | numerator | denominator
110     | PNat      | PNat

# PRat
type    | numerator | denominator
111     | PInt      | PInt


# PNum
type    | dim count | dim lengths   | value
1111    | 256       | list of 2^32  | list of Rats

# Arb
type    | numerator | denominator
11111   | PNum      | PNum


problem with bufferview creations means all chunks will be Uint16.
