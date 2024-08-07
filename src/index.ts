import { Context, Schema, h } from 'koishi'

export const name = 'sticker-to-image'

export const usage = "更新日志：https://forum.koishi.xyz/t/topic/6430"

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.command("表情转图片")
    .action(async ({ session }) => {
      if (session.quote === undefined) {
        await session.send("请在30秒内发送表情")
        let sticker = await session.prompt(30000)

        if (!sticker.includes("img") && !sticker.includes("mface")) {
          return "这看上去不是表情"
        }

        let elements = h.parse(sticker)

        if (h.select(elements, "img").length !== 0) {
          for (let element of h.select(elements, "img")) {
            return h.image(element.attrs.src)
          }
        } 
        
        if (h.select(elements, "mface").length !== 0) {
          for (let element of h.select(elements, "mface")) {
            return h.image(element.attrs.url)
          }
        }

        
      } else {
        if (!session.quote.content.includes("img") && !session.quote.content.includes("mface")) {
          return "这看上去不是表情"
        }

        let elements = h.parse(session.quote.content)

        if (h.select(elements, "img").length !== 0) {
          for (let element of h.select(elements, "img")) {
            return h.image(element.attrs.src)
          }
        } 
        
        if (h.select(elements, "mface").length !== 0) {
          for (let element of h.select(elements, "mface")) {
            return h.image(element.attrs.url)
          }
        }
      }
    })
}
