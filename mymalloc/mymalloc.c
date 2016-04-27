/*
 * File:   mymalloc.c
 * Authors:
 * Mikael Kohlmyr, mk2g10
 * Charles Thompson, cat3g10
 *
 * Description of solution adopted:
 *
 *
 */

/*#include<stdio.h>*/
#include<pthread.h>
#include "rc1.h"

typedef struct node * tnode;
typedef struct rnode * root;

static inline unsigned int int_size_tnode(tnode n);
static inline unsigned int int_size_root(root r);

pthread_mutex_t mutex1 = PTHREAD_MUTEX_INITIALIZER;


struct node{
	unsigned int blocksz;
	tnode next;
	tnode prev;
};

struct rnode{
	unsigned int arrsz; /* array[0] */
	unsigned int freesz; /* array[1] */
	tnode free;
	tnode used;
};

static inline unsigned int int_size_tnode(tnode n){
	return (unsigned int)(sizeof(*n)/sizeof(int));
}

static inline unsigned int int_size_root(root r){
	return (unsigned int)(sizeof(*r)/sizeof(int));
}

int myinit(int * array, int size){
    root head = (root) array;
	register unsigned int headsz = int_size_root(head);
	if(size > (headsz+headsz)){
    		tnode free = (tnode) (array + headsz);
		register unsigned int nodesz = int_size_tnode(free);
		register int diff = size - (nodesz + headsz);
		free = (tnode) (array + headsz);
		head->arrsz = size;
		head->freesz = diff;
		free->blocksz = diff;
		head->free = free;
		head->used = (tnode) 0;
		free->next = (tnode) 0;
		free->prev = (tnode) 0;
		return 1;
	}
    return 0;
}

int * mymalloc(int * array, int size){
	register unsigned int threshold = 8;
	if(array[1] >= size && size > 0){
		register root head = (root) array;
		register tnode current = head->free;
		register unsigned int nodesz = int_size_tnode(current);
		register unsigned int reqsz = (unsigned)size;
		register tnode best = (tnode) 0;
		unsigned int tightness = 4294967295;
		while(1){
			if(current->blocksz >= reqsz){
			register unsigned int diff = (current->blocksz - reqsz);
				if(diff <  tightness){
					tightness = diff;
					best = (tnode)((int *)current);
				}
			}
			if(current->next)
				current = current->next;
			else break;
		}
		if(best){
			if(tightness >= threshold){
				register unsigned int nodeandsz = nodesz + reqsz;
				tnode split = (tnode) (((int *)best) + nodeandsz);
				split->blocksz = best->blocksz - nodeandsz;
				if(head->free == best){
					split->next = best->next;
					if(best->next)
						(best->next)->prev = split;
				}else{
					split->next = head->free;
					if(best->prev == head->free){
						(head->free)->prev = split;
						(head->free)->next = best->next;
						if(best->next)
							(best->next)->prev = head->free;
					}
					else{
						(head->free)->prev = split;
						(best->prev)->next = best->next;
						if(best->next)
							(best->next)->prev = best->prev;
					}
				}
				head->free = split;
				split->prev = (tnode)0;
				best->blocksz = reqsz;
				head->freesz = (head->freesz - nodeandsz);
			}
			else{
				tnode nxt = best->next, pre = best->prev;
				if(pre){
					pre->next = nxt;
					if(nxt){
						nxt->prev = pre;
					}
				}
				else if(nxt){
					head->free = nxt;
					nxt->prev = (tnode) 0;
				}
				else{
					head->free = (tnode) 0;
				}
				head->freesz = (head->freesz - best->blocksz);
			}
			best->next = head->used;
			best->prev = (tnode) 0;
			if(head->used)
				(head->used)->prev = best;
			head->used = best;
			return ((int *)best + nodesz);
		}
	}
	return (int *) 0;
}

int myfree(int * array, int * block){
	register root head = (root) array;
	if(head->used){
		register unsigned int nodesz = int_size_tnode(head->used), headsz = int_size_root(head);
		register tnode blocknode = (tnode)(block - nodesz);
		int * max = array + head->arrsz;
		if(block > array+(headsz-1) && block < max){
			register tnode current = head->used;
			register unsigned int blksz = blocknode->blocksz;
			while(1){
				if(current != blocknode){
					if(current->next){
						if(current->next == current){
							break;
						}
						current = current->next;
						continue;
					}
					break;
				}
				else{
					if(current == head->used){
						head->used = current->next;
						if(current->next)
							(current->next)->prev = (tnode) 0;
					}
					else{
						(current->prev)->next = current->next;
						if(current->next){
							(current->next)->prev = current->prev;
						}
					}
					current->prev = (tnode)0;
					register unsigned int defragged = 0;
					current->next = head->free;
					head->free = current;
					if(current->next){
						(current->next)->prev = current;
						register tnode adjacent = current->next;
						while(1){
							if(((int *)adjacent) == ((int *)current - (adjacent->blocksz + nodesz))){
								adjacent->blocksz = adjacent->blocksz + current->blocksz + nodesz;
								if(current->next != adjacent){
									adjacent->prev->next = adjacent->next;
									if(adjacent->next)
										adjacent->next->prev = adjacent->prev;
									adjacent->next = current->next;
									(current->next)->prev = adjacent;
								}
								adjacent->prev = (tnode) 0;
								current = (tnode)((int *)adjacent);
								head->free = current;
								defragged += nodesz;
							}
							else if(((int *)adjacent) == ((int *)current + (current->blocksz + nodesz))){
								current->blocksz = adjacent->blocksz + current->blocksz + nodesz;
								if(current->next == adjacent){
									current->next = adjacent->next;
									if(adjacent->next)
										(adjacent->next)->prev = current;

								}
								else{

									(adjacent->prev)->next = adjacent->next;
									if(adjacent->next)
										(adjacent->next)->prev = adjacent->prev;
								}
								defragged += nodesz;
							}
							if(adjacent->next){
								adjacent = adjacent->next;
							}
							else break;
						}
					}
					head->freesz = (head->freesz + blksz + defragged);
					return 1;
				}

			}
		}
	}
	return 0;
}

int mydispose(int * array){
	root head = (root) array;
	if(head->free){
		tnode free = head->free;
		return ((!head->used) &&
				(!free->next) &&
				(free->blocksz == head->freesz) &&
				(head->freesz == (head->arrsz - (int_size_root(head) + int_size_tnode(head->free)))));
	}
	return 0;
}

int myinit_mt(int *array, int size){
	pthread_mutex_lock(&mutex1);
		int result = myinit(array, size);
	pthread_mutex_unlock(&mutex1);
	return result;
}
int * mymalloc_mt(int *array, int size){
	pthread_mutex_lock(&mutex1);
		int * addr = mymalloc(array, size);
	pthread_mutex_unlock(&mutex1);
	return addr;
}
int myfree_mt(int *array, int * block){
	pthread_mutex_lock(&mutex1);
		int result = myfree(array, block);
	pthread_mutex_unlock(&mutex1);
	return result;
}
int mydispose_mt(int *array){
	pthread_mutex_lock(&mutex1);
		int result = mydispose(array);
	pthread_mutex_unlock(&mutex1);
	return result;
}
