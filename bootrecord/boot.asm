    BITS 16

ORG 0x7C00       ; Place the program at 0x0000:0x7C00
xor AX, AX       ; Zero ax register (General Purpose (X) Register A)
mov DS, AX       ; Zero Data Segment Register [0x0000]:0x7C00
mov SI, msg      ; Source Index Register used for string and array copying
JMP 0x0000:start ; CS 0x0000 IP start
                 ; JMP to address of start
                 ; IP = Instruction Code Pointer Register

msg db 'Hello World', 0

start:
    lodsb        ; Move one byte from DS:SI to AL and increment the
                 ; address stored in SI by one byte.
                 ;
    or AL, AL    ; Zero implies end of string and will set the zero flag.
    jz done      ; Conditionally jump to given address if zero flag
                 ; was set by the preceeding or operation.
                 ; That is if the Accumulator Register (AL) was empty.
                 ;
                 ; Eventually we will execute a Video Service interrupt
                 ; to print to screen. The BIOS will set up a handler
                 ; for these interrupts.
                 ;
                 ; Video Services use interrupt vector 0x10 and require
                 ; a function code to be defined in the AH register.
                 ; e.g. 0x0E (Write Character in TTY Mode)
                 ;
    mov AH, 0x0E ; Move function code number 0x0E to AH register.
    int 0x10     ; Video interrupt signal, handled by BIOS.
    jmp start    ; Write next character

hang:
    jmp hang

done:
    ret

                          ; A valid Boot Sector is 512 bytes and must
                          ; end in 0xAA55 the standard boot signature.
                          ;
times 510 - ($ - $$) db 0 ; Fill to 510 bytes
                          ;
                          ; 0xAA55 is a 16 bit number s.t.
                          ; 0000 0000 1010 1010 0101 0101
                          ; Hence it splits in to two bytes.
                          ;
db 0x55                   ; Byte 511 is 0x55
db 0xAA                   ; Byte 512 is 0xAA
