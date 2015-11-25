nasm:
	nasm -f bin -o bin/boot.bin boot.asm

floppy:
	sudo dd if=bin/boot.bin of=/dev/fd0

qemu:
	sudo qemu -fda /dev/fd0

clean:
	find bin -name \*.bin -type f -delete
	find . -name \*~ -type f -delete
