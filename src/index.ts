import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: [{
        emit: 'stdout',
        level: 'query'
    }]
})

async function main() {
    console.log('start');
    await test13();
    console.log('end');
}
main()

async function test1() {
    // findUnique 是用来查找唯一的记录的，可以根据主键或者有唯一索引的列来查：
    const aaa = await prisma.aaa.findUnique({
        where: {
            id: 1,
            // name: '' // 不能指定 name，因为通过 name 来查并不能保证记录唯一
        }
    })
    console.log('aaa', aaa);
    const bbb = await prisma.aaa.findUnique({
        where: {
            email: 'bbb@xx.com'
        },
        // 可以通过 select 指定返回的列，结果里就只包含以下这两个字段。
        select: {
            id: true,
            email: true
        }
    })
    console.log('bbb', bbb);
}

async function test2() {
    // findUnique 如果没找到对应的记录会返回 null
    // const aaa = await prisma.aaa.findUnique({
    //     where: {
    //         id: -1
    //     }
    // })
    // findUniqueOrThrow 如果没找到对应的记录会抛异常：NotFoundError [PrismaClientKnownRequestError]: No Aaa found
    const aaa = await prisma.aaa.findUniqueOrThrow({
        where: {
            id: -1
        }
    })
    console.log('aaa', aaa);
}

// findMany 很明显是查找多条记录的。
async function test3() {
    const aaa = await prisma.aaa.findMany({
        where: {
            email: {
                contains: 'xx'
            }
        },
        // 筛选哪些字段
        select: {
            id: true,
            email: true
        },
        // 排序-倒序
        orderBy: {
            name: 'desc'
        },
        skip: 2,
        take: 3
    })
    // [
    //     { id: 3, email: 'ccc@xx.com' },
    //     { id: 2, email: 'bbb@xx.com' },
    //     { id: 1, email: 'aaa@xx.com' }
    //   ]
    console.log('aaa', aaa);
}


// findFirst 返回第一条记录。
async function test4() {
    const aaa = await prisma.aaa.findFirst({
        where: {
            email: {
                // contains 是包含，endsWith 是以什么结尾
                // gt 是 greater than 大于，lte 是 less than or equal 大于等于
                contains: 'xx'
            }
        },
        // 筛选哪些字段
        select: {
            id: true,
            email: true
        },
        // 排序-倒序
        orderBy: {
            name: 'desc'
        },
        skip: 2,
        take: 3
    });
    // { id: 3, email: 'ccc@xx.com' }
    console.log('aaa', aaa);
}

// create 用来创建记录
async function test5() {
    const aaa = await prisma.aaa.create({
        data: {
            name: 'kk',
            email: 'kk@xx.com'
        },
        select: {
            id: true,
            email: true
        }
    })
    // { id: 6, email: 'kk@xx.com' }
    console.log('aaa', aaa);
}

// update 是用来更新的。
// 它可以指定 where 条件，指定 data，还可以指定 select 出的字段
async function test6() {
    const aaa = await prisma.aaa.update({
        data: {
            email: '3333@xx.com'
        },
        where: {
            id: 3
        },
        select: {
            id: true,
            email: true
        }
    })
    // { id: 6, email: 'kk@xx.com' }
    console.log('aaa', aaa);
}

// updateMany 更新多条记录。
async function test7() {
    const aaa = await prisma.aaa.updateMany({
        where: {
            email: {
                contains: 'xx'
            }
        },
        data: { name: '666' },
    })
    console.log('aaa', aaa);
} 

// upsert 是 update 和 insert 的意思。
// 当传入的 id 有对应记录的时候，会更新，否则，会创建记录。
async function test8() {
    const aaa = await prisma.aaa.upsert({
        create: {
            id:  11,
            name: 'xxx',
            email: 'xxx@xx.com'
        },
        update: {
            email: 'yyy@xx.com'
        },
        where: {
            id:  11,
        }
    })
    // start
    // prisma:query BEGIN
    // prisma:query SELECT `prisma_test`.`Aaa`.`id` FROM `prisma_test`.`Aaa` WHERE (`prisma_test`.`Aaa`.`id` = ? AND 1=1)
    // prisma:query UPDATE `prisma_test`.`Aaa` SET `email` = ? WHERE (`prisma_test`.`Aaa`.`id` IN (?) AND (`prisma_test`.`Aaa`.`id` = ? AND 1=1))
    // prisma:query SELECT `prisma_test`.`Aaa`.`id`, `prisma_test`.`Aaa`.`email`, `prisma_test`.`Aaa`.`name` FROM `prisma_test`.`Aaa` WHERE `prisma_test`.`Aaa`.`id` = ? LIMIT ? OFFSET ?
    // prisma:query COMMIT
    // aaa { id: 11, email: 'yyy@xx.com', name: 'xxx' }
    // end
    console.log('aaa', aaa);
}

// 删除
async function test9() {
    await prisma.aaa.delete({
        where: {
            id: 1
        }
    })
    await prisma.aaa.deleteMany({
        where: {
            id: {
                in: [2, 11]
            }
        } 
    })
}


async function test10() {
    const res = await prisma.aaa.count({
        where: {
            email: {
                contains: 'xx'
            }
        },
        orderBy: {
            name: 'desc'
        },
        // 跳过几条
        skip: 2,
        // 获取几条
        take: 3
    });
    // 2
    console.log(res);
}

async function test11() {
    await prisma.aaa.update({
        where: {
            id: 3
        },
        data: {
            age: 3
        }
    })
    await prisma.aaa.update({
        where: {
            id: 5
        },
        data: {
            age: 5
        }
    })
}


async function test12() {
    const res = await prisma.aaa.aggregate({
        where: {
            email: {
                contains: 'xx'
            }
        },
        // 最大值、最小值、计数、平均值
        _count: {
            _all: true
        },
        _max: {
            age: true
        },
        _min: {
            age: true
        },
        _avg: {
            age: true
        }
    });
    console.log('res', res)
}


async function test13() {
    const res = await prisma.aaa.groupBy({
        // 按照 email 分组，过滤出平均年龄大于 2 的分组，计算年龄总和返回
        by: ['email'],
        _count: {
            _all: true
        },
        _sum: {
            age: true
        },
        having: {
            age: {
                _avg: {
                    gt: 2
                }
            }
        }
    })
    // [
    //     { _count: { _all: 1 }, _sum: { age: 3 }, email: '3333@xx.com' },
    //     { _count: { _all: 1 }, _sum: { age: 5 }, email: 'eee@xx.com' }
    // ]
    console.log('res', res)
}