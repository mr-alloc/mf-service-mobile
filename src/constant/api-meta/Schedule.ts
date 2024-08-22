import Spec from '@/constant/api-meta/ApiSpecification'
import { HttpMethod } from '@/constant/HttpMethod'

export default {
    GetCategories: Spec.of(HttpMethod.GET, '/v1/schedule-category')
        .andDefaultMessage('카테고리 정보를 불러오는데 실패 했어요.')
        .andPairs([]),
    CreateCategory: Spec.of(HttpMethod.POST, '/v1/schedule-category')
        .andDefaultMessage('카테고리를 생성하는데 실패 했어요.')
        .andPairs([])
}
