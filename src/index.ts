import { Context, Schema, h, Session } from 'koishi'

export const name = 'sticker-to-image'

export const usage = "更新日志：https://forum.koishi.xyz/t/topic/6430"

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.command("表情转图片")
    .action(async ({ session }) => {
      await send(session, h.image)
    })

  ctx.command("表情转文件", "gif可用")
    .action(async ({ session }) => {
      await send(session, h.file)
    })

  async function send(session: Session<never, never, Context>, handler: h.Factory<[data: string] | [data: Buffer | ArrayBuffer | ArrayBufferView, type: string]>) {
    let sticker: string

    if (session.quote === undefined) {
      await session.send("请在30秒内发送表情")
      sticker = await session.prompt(30000)
    } else {
      sticker = session.quote.content
    }
    
    if (!sticker.includes("img") && !sticker.includes("mface")) {
      return "这看上去不是表情"
    }

    let elements = h.parse(sticker)

    for (let element of h.select(elements, "img")) {
      // let image = await ctx.http("GET", element.attrs.src, { responseType: "arraybuffer" })
      await session.send(handler(element.attrs.src))
    }
  
    for (let element of h.select(elements, "mface")) {
      // let image = await ctx.http("GET", element.attrs.src, { responseType: "arraybuffer" })
      try {
        await session.send(handler(element.attrs.src))
      } catch {
        await session.send(handler(element.attrs.url))
      }
      
    }
  }

  
}
